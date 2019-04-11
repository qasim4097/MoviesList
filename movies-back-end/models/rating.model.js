const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Rating = Schema({
    _creator : { type: Schema.Types.ObjectId, ref: 'user' },
    comment  : String,
    rating: {
        type: Number,
        default: 0
    },
    movie: { type: Schema.Types.ObjectId, ref: 'movie' }
  });

module.exports = mongoose.model('Rating', Rating);
