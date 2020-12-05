// Puerto
process.env.PORT = process.env.PORT || 3000;
process.env.SECURE_PORT = process.env.SECURE_PORT || 4000;

// Servidor de base de datos
process.env.DB_URI = process.env.DB_URI || 'mongodb://localhost/';

// Nombre de base de datos
process.env.DB_NAME = process.env.DB_NAME || 'test';

// Vencimiento token
process.env.CADUCIDAD_TOKEN = '7 days';

// SEED de autenticacion
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';