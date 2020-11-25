require('./config/general');
require('./config/database');

const express = require('express');
const cors = require('cors');

const app = express();

// Configuración de cabeceras y CORS (la configuración va antes de las rutas)
app.use(cors({ origin: true, credentials: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept");
    next();
});

// Configuracion del BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configuración global de las rutas
app.use(require('./routes/index.routes'));

app.listen(process.env.PORT, () => {
    console.log('Listening on port: ' + process.env.PORT);
});