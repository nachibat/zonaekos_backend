const express = require('express');

const app = express();

app.use(require('./usuarios.route'));
app.use(require('./login.route'));
app.use(require('./peliculas.route'));

module.exports = app;