const express = require('express');
const Pelicula = require('../models/pelicula.model');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const { uriTransformation } = require('../helpers/strings');
const _ = require('underscore');

const app = express();

// Alta de pelicula
app.post('/peliculas', [verificaToken, verificaAdminRole], (req, res) => {
    const body = req.body;
    const uri = uriTransformation(body.title);
    const today = new Date().toISOString().slice(0, 10);
    const pelicula = new Pelicula({
        title: body.title,
        original_title: body.original_title,
        uri,
        overview: body.overview,
        categoria: body.categoria,
        publish_date: today,
        release_date: body.release_date,
        vote_average: body.vote_average,
        vote_count: body.vote_count,
        genre: body.genre,
        backdrop_path: body.backdrop_path,
        poster_path: body.poster_path,
        stream_link: body.stream_link,
        stream_link_en: body.stream_link_en,
        download_link: body.download_link
    });
    pelicula.save((err, peliculaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            pelicula: peliculaDB
        });
    });
});

// Listado general de peliculas
app.get('/peliculas', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const orden = req.query.orden || '';
    Pelicula.find({})
        .skip(desde)
        .limit(limite)
        .sort(orden)
        .exec((err, peliculas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Pelicula.countDocuments({}, (err, cant) => {
                res.json({
                    ok: true,
                    total_registros: cant,
                    peliculas
                });
            });
        });
});

// Busqueda por titulo
app.get('/peliculas/buscar/title/:termino', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 12;
    const orden = req.query.orden || '';
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    Pelicula.find({ title: regex })
        .skip(desde)
        .limit(limite)
        .sort(orden)
        .exec((err, peliculas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Pelicula.countDocuments({ title: regex }, (err, cant) => {
                res.json({
                    ok: true,
                    total_registros: cant,
                    peliculas
                });
            });
        });
});

// Busqueda por genero
app.get('/peliculas/buscar/genre/:termino', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 12;
    const orden = req.query.orden || '';
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    Pelicula.find({ genre: regex })
        .skip(desde)
        .limit(limite)
        .sort(orden)
        .exec((err, peliculas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Pelicula.countDocuments({ genre: regex }, (err, cant) => {
                res.json({
                    ok: true,
                    total_registros: cant,
                    peliculas
                });
            });
        });
});

// Modificacion de pelicula
app.put('/pelicula/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const uri = uriTransformation(req.body.title);
    let body = _.pick(req.body, ['title', 'original_title', 'overview', 'categoria', 'publish_date', 'release_date', 'vote_average', 'vote_count', 'genre', 'backdrop_path', 'poster_path', 'stream_link', 'stream_link_en', 'download_link']);
    body.uri = uri;
    Pelicula.findByIdAndUpdate(id, body, { new: true }, (err, peliculaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            pelicula: peliculaDB
        });
    });
});

// Baja de pelicula
app.delete('/pelicula/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    Pelicula.findByIdAndRemove(id, (err, peliculaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!peliculaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Can\'t find movie'
                }
            });
        }
        return res.json({
            ok: true,
            peliculaBorrada
        });
    });
});

// Busqueda de pelicula por id
app.get('/pelicula/:id', (req, res) => {
    const id = req.params.id;
    Pelicula.findById(id, (err, peliculaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            peliculaDB
        });
    });
});

// Busqueda de pelicula por uri
app.get('/pelicula/buscar/:uri', (req, res) => {
    const uri = req.params.uri;
    Pelicula.findOne({ uri }, (err, peliculaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            peliculaDB
        });
    });
});

module.exports = app;