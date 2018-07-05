const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('Hola Mundo');
});
app.post('/usuario', (req, res) => {
    let body = req.body;
    res.json(body);
});
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id: id
    });
});
app.delete('/usuario/:id', (req, res) => {
    res.json('Delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto: " + process.env.PORT);
});