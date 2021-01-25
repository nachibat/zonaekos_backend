const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reporteSchema = new Schema({
    usuario: String,
    pelicula: String,
    estado: Boolean,
    fecha: Date
});

module.exports = mongoose.model('Reporte', reporteSchema);