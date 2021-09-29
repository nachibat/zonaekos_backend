const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const peliculaSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Title required']
    },
    original_title: {
        type: String,
        required: [true, 'Original title required']
    },
    uri: {
        type: String,
        unique: true,
        required: [true, 'Uri required']
    },
    overview: {
        type: String,
        required: [true, 'Overview required']
    },
    publish_date: {
        type: String,
        required: [true, 'Publish date required']
    },
    release_date: {
        type: String,
        required: [true, 'Release date required']
    },
    vote_average: {
        type: Number,
        required: [true, 'Vote average required']
    },
    vote_count: {
        type: Number,
        required: [true, 'Vote count required']
    },
    categoria: {
        type: String,
        default: 'general'
    },
    genre: {
        type: String,
        required: [true, 'Genre required']
    },
    backdrop_path: {
        type: String,
        default: 'no_image'
    },
    poster_path: {
        type: String,
        default: 'no_image'
    },
    stream_link: {
        type: String,
        default: null
    },
    stream_link_en: {
        type: String,
        default: null
    },
    download_link: {
        type: String,
        default: null
    }
});

peliculaSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Pelicula', peliculaSchema);