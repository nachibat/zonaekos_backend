const express = require('express');

const app = express();

app.use(require('./usuarios.route'));
app.use(require('./login.route'));
app.use(require('./peliculas.route'));
app.use(require('./reportes.route'));

module.exports = app;