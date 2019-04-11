var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.model');

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
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
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, email, password, done) {
        if (email)
            email = email.toLowerCase();
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({ 'email': email }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, { message: 'Email already exists.' });
                    } else {
                        var newUser = new User();
                        newUser.name = req.body.name
                        newUser.email = email;
                        newUser.password = password;
                        newUser.save(function (err) {
                            if (err)
                                return done(err);
                            return done(null, newUser);
                        });
                    }

                });
            } else if (!req.user.email) {
                User.findOne({ 'email': email }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, { message: 'Email already exists.' });
                    } else {
                        var user = req.user;
                        user.name = req.body.name;
                        user.email = email;
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