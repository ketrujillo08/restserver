process.env.PORT = process.env.PORT || 7070;

//===================
//Entorno
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
//Base de Datos
//===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGOURI;
}
process.env.URLDB = urlDB;