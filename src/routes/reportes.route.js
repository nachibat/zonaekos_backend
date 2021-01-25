const express = require('express');
const Reporte = require('../models/reporte.model');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

// Alta de reporte
app.post('/reportes', verificaToken, (req, res) => {
    const pelicula = req.body.pelicula;
    const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)); // Formato para la zona horaria de argentina
    const reporte = new Reporte({
        usuario: req.usuario._id,
        pelicula,
        estado: true,
        fecha: today
    });
    reporte.save((err, reporteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            reporte: reporteDB
        });
    });
});

// Listado del reporte
app.get('/reportes', [verificaToken, verificaAdminRole], (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 10;
    Reporte.find({ estado: true })
        .populate({
            path: 'usuario',
            model: 'Usuario',
            select: { 'fullname': 1, 'email': 1, 'img': 1 }
        })
        .populate({
            path: 'pelicula',
            model: 'Pelicula',
            select: { 'title': 1, 'poster_path': 1 }
        })
        .skip(desde)
        .limit(limite)
        .exec((err, reportes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Reporte.countDocuments({ estado: true }, (err, total) => {
                return res.json({
                    ok: true,
                    total,
                    reportes
                });
            });
        });
});

// Reporte por id_pelicula
app.get('/reportes/:id', (req, res) => {
    const id = req.params.id;
    Reporte.find({ pelicula: id, estado: true }, (err, reporteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            reportes: reporteDB
        });
    });
});

// Cambio de estado del reporte
app.put('/reportes/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const body = { estado: false };
    Reporte.findByIdAndUpdate(id, body, { new: true }, (err, reporteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Can\'t find report' }
            });
        }
        return res.json({
            ok: true,
            reporte: reporteDB
        });
    });
});

// Baja del reporte
app.delete('/reportes', (req, res) => {
    return res.json({
        ok: true,
        message: 'Baja del reporte'
    });
});

module.exports = app;