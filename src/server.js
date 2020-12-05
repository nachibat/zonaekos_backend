require('./config/general');
require('./config/database');

const fs = require('fs');
const https = require('https');

const express = require('express');
const cors = require('cors');

const ssl_options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
};

const app = express();


// Configuracion del BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de cabeceras y CORS
app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION');
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTION');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept');
    next();
});

// Configuración global de las rutas
app.use(require('./routes/index.routes'));

// Inicio del server

// app.listen(process.env.PORT, () => {
//     console.log('Listening on port: ' + process.env.PORT);
// });

https.createServer(ssl_options, app).listen(process.env.SECURE_PORT, () => {
    console.log('Listening on secure port: ' + process.env.SECURE_PORT);
});