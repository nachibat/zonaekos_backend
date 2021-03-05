const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serieSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title required']
    },
    original_title: String,
    overview: String,
    categoria: {
        type: String,
        default: 'general'
    },
    genre: {
        type: String,
        required: [true, 'Genre required']
    },
    poster_path: {
        type: String,
        default: 'no_image'
    },
    backdrop_path: {
        type: String,
        default: 'no_image'
    },
    modified: Date
});

module.exports = mongoose.model('Serie', serieSchema);