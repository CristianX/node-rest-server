//  =====================
// Puerto
// =====================

process.env.PORT = process.env.PORT || 3000;

//  =====================
// Entorno
// =====================

//NODE_ENV es una variable que establece heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//  =====================
// Base de datos
// =====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

// Variable URLDB personalizada
process.env.URLDB = urlDB;