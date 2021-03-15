const express = require('express');
const Capitulo = require('../models/capitulo.model');
const Serie = require('../models/serie.model');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

// Busqueda de capitulo por ID
app.get('/capitulos/:id', (req, res) => {
    const id = req.params.id;
    Capitulo.findById(id)
        .populate({
            path: 'serie',
            model: 'Serie',
            select: { 'title': 1, 'poster_path': 1 }
        })
        .exec((err, capituloEncontrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                capituloEncontrado
            });
        });
});

// Listado de capitulos de una serie
app.get('/capitulos/listado/:idserie', (req, res) => {
    const idSerie = req.params.idserie;
    const season = Number(req.query.season) || 1;
    Capitulo.find({ serie: idSerie, season: season })
        .populate({
            path: 'serie',
            model: 'Serie',
            select: { 'title': 1 }
        })
        .exec((err, capitulos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Capitulo.countDocuments({ serie: idSerie, season: season }, (err, total) => {
                return res.json({
                    ok: true,
                    total,
                    capitulos
                });
            });
        });
});

// Alta de capitulos
app.post('/capitulos', [verificaToken, verificaAdminRole], (req, res) => {
    const body = req.body;
    const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)); // Formato para la zona horaria de argentina
    const capitulo = new Capitulo({
        serie: body.serie,
        season: body.season,
        chapter: body.chapter,
        title: body.title,
        overview: body.overview,
        stream_link_ori: body.stream_link_ori,
        stream_link_lat: body.stream_link_lat,
        download_link: body.download_link,
        release_date: body.release_date,
        publish_date: today
    });
    capitulo.save((err, capituloDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Serie.findByIdAndUpdate(body.serie, { modified: today }, () => {
            return res.json({
                ok: true,
                capitulo: capituloDB
            });
        });
    });
});

// Baja de capitulos
app.delete('/capitulos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    Capitulo.findByIdAndRemove(id, (err, capituloBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!capituloBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Can\'t find chapter' }
            });
        }
        return res.json({
            ok: true,
            capituloBorrado
        });
    });
});

// Modificacion de capitulos
app.put('/capitulos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)); // Formato para la zona horaria de argentina
    const body = _.pick(req.body, ['serie', 'season', 'chapter', 'title', 'overview', 'stream_link_ori', 'stream_link_lat', 'download_link', 'release_date', 'reported']);
    let serieID;
    Capitulo.findById(id, (err, capitulo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        serieID = capitulo.serie;
    });
    Capitulo.findByIdAndUpdate(id, body, { new: true }, (err, capituloModificado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Serie.findByIdAndUpdate(serieID, { modified: today }, () => {
            return res.json({
                ok: true,
                capituloModificado
            });
        });
    });
});

// Reporte links caidos
app.put('/capitulo/reporte/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = { reported: true };
    Capitulo.findByIdAndUpdate(id, body, { new: true }, (err, capReportado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Can\'t find chapter' }
            });
        }
        return res.json({
            ok: true,
            capReportado
        });
    });
});

module.exports = app;