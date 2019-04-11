var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.model');

passport.use('local', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
},
    function (name, password, done) {
        User.findOne({ name: name }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.password == password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, name, password, done) {
        if (name)
            name = name.toLowerCase();
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({ 'name': name }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, { message: 'Name already exists.' });
                    } else {
                        var newUser = new User();
                        newUser.name = req.body.name
                        newUser.password = password;
                        newUser.save(function (err) {
                            if (err)
                                return done(err);
                            return done(null, newUser);
                        });
                    }

                });
            } else if (!req.user.name) {
                User.findOne({ 'name': name }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, { message: 'Name already exists.' });
                    } else {
                        var user = req.user;
                        user.name = req.body.name;
                        user.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });
                    }
                });
            } else {
                return done(null, user);
            }
        });

    }));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});