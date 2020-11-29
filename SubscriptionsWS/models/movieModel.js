const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
    name: String,
    genres: [],
    image: {
        medium: String,
        original: String
        },
    premiered: Date
})

module.exports = mongoose.model('movies', MoviesSchema)