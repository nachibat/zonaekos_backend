// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Puerto
process.env.PORT = process.env.PORT || 3000;
process.env.SECURE_PORT = process.env.SECURE_PORT || 4000;

// Servidor de base de datos
process.env.USER_DB = process.env.USER_DB || 'test';
process.env.PASS_DB = process.env.PASS_DB || 'test';
process.env.DB_URI = process.env.DB_URI || `mongodb://${process.env.USER_DB}:${process.env.PASS_DB}@localhost`;
process.env.DB_NAME = process.env.DB_NAME || 'test';

// Vencimiento token
process.env.CADUCIDAD_TOKEN = '7 days';

// SEED de autenticacion
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// Clients ID
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'xxx-xxxxxxxx.apps.googleusercontent.com';