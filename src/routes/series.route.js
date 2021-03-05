const express = require('express');
const Serie = require('../models/serie.model');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

// Busqueda de serie por id
app.get('/series/:id', (req, res) => {
    const id = req.params.id;
    Serie.findById(id, (err, serieEncontrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            serieEncontrada
        });
    });
});

// Listado de series
app.get('/series', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const orden = req.query.orden || '';
    Serie.find({})
        .skip(desde)
        .limit(limite)
        .sort(orden)
        .exec((err, series) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Serie.countDocuments({}, (err, total) => {
                return res.json({
                    ok: true,
                    total,
                    series
                });
            });
        });
});

// Alta de series
app.post('/series', [verificaToken, verificaAdminRole], (req, res) => {
    const body = req.body;
    const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)); // Formato para la zona horaria de argentina
    const serie = new Serie({
        title: body.title,
        original_title: body.original_title,
        overview: body.overview,
        categoria: body.categoria,
        genre: body.genre,
        poster_path: body.poster_path,
        backdrop_path: body.backdrop_path,
        modified: today
    });
    serie.save((err, serieDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            serie: serieDB
        });
    });
});

// Baja de series
app.delete('/series/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    Serie.findByIdAndRemove(id, (err, serieBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!serieBorrada) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Can\'t find serie' }
            });
        }
        return res.json({
            ok: true,
            serieBorrada
        });
    });
});

// Modificacion de series
app.put('/series/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['title', 'original_title', 'overview', 'categoria', 'genre', 'poster_path', 'backdrop_path']);
    Serie.findByIdAndUpdate(id, body, { new: true }, (err, serieModificada) => {
        if (err) {
            return res.status(500), json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            serieModificada
        });
    });
});

module.exports = app;