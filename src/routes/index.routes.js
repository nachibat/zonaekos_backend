const express = require('express');

const app = express();

app.use(require('./usuarios.route'));
app.use(require('./login.route'));

module.exports = app;