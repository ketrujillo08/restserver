process.env.PORT = process.env.PORT || 7070;

//===================
//Entorno
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
//Base de Datos
//===================

//===================
//Expires TOKEN
//===================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===================
//SEED
//===================

process.env.SEED = process.env.SEED || 'BATMAN';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGOURI;
}
process.env.URLDB = urlDB;

//GoogleClientID

process.env.CLIENT_ID = process.env.CLIENT_ID || '461670666022-4t54ev7b4bvh1chk9qm4l3nu56t0esch.apps.googleusercontent.com';