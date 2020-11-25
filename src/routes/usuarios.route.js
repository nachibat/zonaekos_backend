const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario.model');

const app = express();

// Listado de usuarios
app.get('/usuarios', (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    usuarios
                });
            });
        });
});

// Alta de usuario
app.post('/usuario', (req, res) => {
    const body = req.body;
    const usuario = new Usuario({
        fullname: body.fullname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Modificacion de usuario
app.put('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['fullname', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Eliminacion de usuario (fisica)
app.delete('/usuario/purge/:id', (req, res) => {
    const id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.json(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Can not find user'
                }
            });
        }
        return res.json({
            ok: true,
            usuarioBorrado
        });
    });
});

// Eliminacion de usuario (cambio de estado a false)
app.delete('/usuario/:id', (req, res) => {
    const id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            usuarioBorrado
        });
    });
});

module.exports = app;