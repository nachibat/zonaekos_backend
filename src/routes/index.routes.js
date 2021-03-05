const express = require('express');

const app = express();

app.use(require('./usuarios.route'));
app.use(require('./login.route'));
app.use(require('./peliculas.route'));
app.use(require('./reportes.route'));
app.use(require('./series.route'));
app.use(require('./capitulos.route'));

module.exports = app;