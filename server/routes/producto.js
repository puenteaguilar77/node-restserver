const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion')

let app = express();
let Producto = require('../models/producto');

// ==============================
// Obtener Productos
// ==============================
app.get('/producto', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario y categoría
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        //.sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    conteos: conteo
                });

            });


        })


});

// ==============================
// Obtener Productos por Id
// ==============================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario y categoría

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {

                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El id no se encontró'
                    }
                });
            }

            res.json({

                ok: true,
                producto: productoDB

            })

        })


});

// ==============================
// Buscar Productos
// ==============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({

                ok: true,
                productos

            })

        })

});




// ==============================
// Crear nuevo Producto
// ==============================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoría del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});



// ==============================
// Actualizar un Producto
// ==============================
app.put('/producto/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoría del listado

    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    };

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({

            ok: true,
            prod: productoDB
        });
    })


});


// ==============================
// Borrar Producto
// ==============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar disponible en falso


    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBorrado) => {

            if (err) {
                return res.status(400).json({

                    ok: false,
                    err
                });
            };

            if (productoBorrado === null) {
                return res.status(400).json({

                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado exitósamente'
            })

        })

});

module.exports = app;