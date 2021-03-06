// ==========================
// Puerto
// ==========================

process.env.PORT = process.env.PORT || 3000;

// ==========================
// Entorno
// ==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==========================
// Vencimiento del Toñen
// ==========================
// 60 segundos
// 60 minutos
// 24 horas
// 90 días
process.env.CADUCIDAD_TOKEN = '72h';

// ==========================
// Seed de autenticación
// ==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==========================
// Base de datos
// ==========================

let urlDB;


if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

// ==========================
// Google Client ID
// ==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || process.env.CLT_GOOGLE;