var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();
var Medico = require('../models/medico');

var middlewaresAutenticacion = require('../middlewares/autenticacion');

//==================================================
// Obtener Medicos
//==================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }


            Medico.count({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });



        });
});



//==================================================
// Actualizar  medico
//==================================================
app.put('/:id', middlewaresAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id: ' + id + ' no existe ',
                errors: { message: 'no existe un medico con ese Id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });
});


//==================================================
// Crear Nuevo medico
//==================================================
app.post('/', middlewaresAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        });

    });

});


//==================================================
// Eliminar medico
//==================================================
app.delete('/:id', middlewaresAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe medico con ese id',
                errors: { message: 'no existe un medico con ese Id' }
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;