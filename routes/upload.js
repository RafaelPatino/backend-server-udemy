var express = require('express');
var app = express();

var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    //tipos de coleccion
    var tipoValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es validad',
            errors: { message: 'Los tipos válidos son' + tipoValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: { message: 'debe seleccionar una imagen' }
        });
    }


    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombrecortado = archivo.name.split('.');
    var extensionArchivo = nombrecortado[nombrecortado.length - 1];

    //solo esta extenciones permitimo
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones válidas son' + extensionesValidas.join(', ') }
        });
    }

    //nombre de archivo personalizado
    //21212121-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo}`;

    //mover el archivo del temporal a un path en especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo}`;


    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
        /*  res.status(200).json({
             ok: true,
             mensaje: 'Archivo movido'
         }) */

    });


});


function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'usuario no exite',
                    errors: { message: 'usuario no existe' }
                })
            }

            var pathviejo = './upload/usuarios/' + usuario.png;
            //si existe elimina la imagen anterior
            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo)
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del usuario actualizada',
                    usuario: usuarioActualizado
                })

            });

        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'medico no exite',
                    errors: { message: 'medico no existe' }
                })
            }

            var pathviejo = './upload/medicos/' + medico.png;
            //si existe elimina la imagen anterior
            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo)
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del medico actualizada',
                    medico: medicoActualizado
                })

            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'hospital no exite',
                    errors: { message: 'hospital no existe' }
                })
            }

            var pathviejo = './upload/hospitales/' + hospital.png;
            //si existe elimina la imagen anterior
            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo)
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del hospital actualizada',
                    hospital: hospitalActualizado
                })

            });

        });
    }
}


module.exports = app;