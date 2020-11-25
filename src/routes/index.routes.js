const express = require('express');

const app = express();

app.use(require('./usuarios.route'));

module.exports = app;