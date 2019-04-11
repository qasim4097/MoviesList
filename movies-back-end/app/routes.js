var jwt = require('jsonwebtoken');
let Movie = require('../models/movie.model');
let Rating = require('../models/rating.model');
let User = require('../models/user.model')

/** Routes */
module.exports = function (app, passport) {

    /** Registering a user **/
    app.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err) { return res.status(501).json(err); }
            if (!user) {
                return res.status(400).send({
                    status: 400,
                    message: info.message
                });
            }
            req.logIn(user, function (err) {
                if (err) { 
                    return res.status(501).json(err); 
                }
                return res.status(200).send({
                    status: 200,
                    user: user,
                });
            });
        })(req, res, next);
    });

    app.get('/', (req, res, next) => {
        Movie.find(function (err, movies) {
            Rating.find(function(err, ratings){
                if (err) {
                    console.log(err);
                }
                else {
                    res.json({
                        movies: movies,
                        movie_ratings: ratings});
                }    
            })
        })
    })

    app.get('/:id', (req, res, next) => {
        let id = req.params.id
        Movie.findById(id, function (err, movie) {
            if (!movie) {
                res.status(400).send('data not found');
            }
            else{
                res.json(movie);
            }
        });
    });

    /** Add movie based on the data passed */
    
    app.post('/add', (req, res, next) => {
        let movie = new Movie
        movie.movie_duration = req.body.movie_duration
        movie.movie_description = req.body.movie_description
        movie.movie_name = req.body.movie_name
        movie.save()
            .then(movie => {
                res.status(200).json({ 'movie': ' movie added successfully ' });
            })
            .catch(err => {
                res.status(400).send('adding failed')
            })
    });
    
    app.post('/update/:id', (req, res, next) => {
        Movie.findById(req.params.id, function (err, movie) {
            if (!movie) {
                res.status(400).send('data not found');
            }
            else {
                movie.movie_duration = req.body.movie_duration
                movie.movie_description = req.body.movie_description
                movie.movie_name = req.body.movie_name
            }
    
            movie.save().then(movie => {
                res.json('Movie updated');
            })
                .catch(err => {
                    res.status(400).send('Update not successful')
                })
        })
    })

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', function (err, user, info) {
            if (err) { return res.status(501).json(err); }
            if (!user) {
                return res.status(400).send({
                    status: 400,
                    message: info.message
                });
            }
            req.logIn(user, function (err) {
                if (err) { return res.status(501).json(err); }
                user = user.toObject();
                delete user["password"];
                return res.status(200).send({
                    status: 200,
                    user: user,
                    token: user._id
                });
            });
        })(req, res, next);
    });
    
    app.get('/delete/:id', function (req, res) {
        Movie.findByIdAndDelete(req.params.id, function (err, movie) {
            if (!movie) {
                res.status(400).send('data not found');
            }
            else{
                res.status(200).send({
                    status: 200,
                    message: "successfuly deleted"
                })
            }
        });
    });

    /** Rate a movie based on the 
     * rating provided by the user
     * (total_rating / total_ratings)
    */
    app.post('/rate/:id', (req, res) => {
        User.findById(req.body._creator, function (err, user) {
            Movie.findById(req.body.movie, function(err, movie){
                let rating = new Rating;
                rating.rating = req.body.rating
                rating.comment = req.body.comment
                rating._creator = user._id
                rating.movie = movie._id
                rating.save().then(rating => {
                    Rating.find({ movie: movie._id}).exec(function (err, results) {
                        var count = results.length
                        movie.total_rating += rating.rating 
                        movie.movie_rating = movie.total_rating / count
                        movie.save()
                        res.json('Rated');
                    });
                })
                .catch(err => {
                    console.log(err)
                })
            })
        })
    })
    
};