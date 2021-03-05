const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const capituloSchema = new Schema({
    serie: {
        type: String,
        required: [true, 'Serie ID required']
    },
    season: {
        type: Number,
        required: [true, 'Season required']
    },
    chapter: {
        type: Number,
        required: [true, 'Chapter required']
    },
    title: {
        type: String,
        default: null
    },
    overview: {
        type: String,
        default: null
    },
    stream_link_ori: {
        type: String,
        default: null
    },
    stream_link_lat: {
        type: String,
        default: null
    },
    download_link: {
        type: String,
        default: null
    },
    release_date: Date,
    publish_date: {
        type: Date,
        default: null
    },
    reported: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Capitulo', capituloSchema);