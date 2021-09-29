const express = require('express');
const Serie = require('../models/serie.model');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const { uriTransformation } = require('../helpers/strings');
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

// Busqueda de serie por uri
app.get('/series/buscar/uri/:uri', (req, res) => {
    const uri = req.params.uri;
    Serie.findOne({ uri }, (err, serieEncontrada) => {
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

// Busqueda por titulo
app.get('/series/buscar/title/:termino', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 12;
    const orde = req.query.orden || '';
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    Serie.find({ title: regex })
        .skip(desde)
        .limit(limite)
        .sort(orde)
        .exec((err, series) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Serie.countDocuments({ title: regex }, (err, cant) => {
                res.json({
                    ok: true,
                    total_registros: cant,
                    series
                });
            })
        });
});

// Busqueda por genero
app.get('/series/buscar/genre/:termino', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 12;
    const orden = req.params.orden || '';
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    Serie.find({ genre: regex })
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
            Serie.countDocuments({ genre: regex }, (err, cant) => {
                res.json({
                    ok: true,
                    total_registros: cant,
                    series
                });
            });
        });
});

// Alta de series
app.post('/series', [verificaToken, verificaAdminRole], (req, res) => {
    const body = req.body;
    const uri = uriTransformation(body.title);
    const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)); // Formato para la zona horaria de argentina
    const serie = new Serie({
        title: body.title,
        original_title: body.original_title,
        uri,
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
    const uri = uriTransformation(req.body.title);
    let body = _.pick(req.body, ['title', 'original_title', 'overview', 'categoria', 'genre', 'poster_path', 'backdrop_path']);
    body.uri = uri;
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