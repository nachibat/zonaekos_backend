const express = require('express');
const Pelicula = require('../models/pelicula.model');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

// Alta de pelicula
app.post('/peliculas', [verificaToken, verificaAdminRole], (req, res) => {
    const body = req.body;
    const today = new Date().toISOString().slice(0, 10);
    const pelicula = new Pelicula({
        title: body.title,
        original_title: body.original_title,
        overview: body.overview,
        publish_date: today,
        release_date: body.release_date,
        vote_average: body.vote_average,
        vote_count: body.vote_count,
        genre: body.genre,
        backdrop_path: body.backdrop_path,
        poster_path: body.poster_path,
        stream_link: body.stream_link,
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
    const orden = req.query.orden || ''
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

// Modificacion de pelicula
app.put('/pelicula/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['title', 'original_title', 'overview', 'publish_date', 'release_date', 'vote_average', 'vote_count', 'genre', 'backdrop_path', 'poster_path', 'stream_link', 'download_link']);
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

module.exports = app;