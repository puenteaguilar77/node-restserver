const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria')

let app = express();


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })

});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no se encontró'
                }
            });
        }

        res.json({

            ok: true,
            categoria: categoriaDB

        })

    })

});


app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.put('/categoria/:id', verificaToken, function(req, res) {



    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({

            ok: true,
            usuario: categoriaDB
        });
    })
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {



    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada exitósamente'
        })

    })

});




module.exports = app;