const mongoose = require('mongoose');
const Schema = mongoose.Schema;



let Movie = new Schema({
    movie_name: String,
    movie_description: String,
    movie_duration: Number,
    movie_release_date: Date,
    movie_actors: String,
    movie_rating: {
        type: Number,
        default: 0
    },
    total_rating: {
        type: Number,
        default: 0
    }
})



module.exports = mongoose.model('Movie', Movie);