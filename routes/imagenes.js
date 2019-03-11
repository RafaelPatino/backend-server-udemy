// Requires
var express = require('express');

//inicializar variables
var app = express();

const path = require('path');
const fs = require('fs');

// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        var pathNOImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNOImagen)
    }


});

module.exports = app;