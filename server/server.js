require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const colors = require('colors');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/user', function(req, res) {


    res.json('get Usuario')
})

app.post('/user', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({

            ok: false,
            mensaje: 'El nombre es necesaario'

        });
    } else {
        res.json({
            persona: body
        })
    }


})


app.put('/user/:id', function(req, res) {
    let id = req.params.id
    res.json({
        id
    });
})

app.delete('/user', function(req, res) {
    res.json('delete Usuario')
})


app.listen(process.env.PORT, () => {
    console.log(colors.blue('escuchando en el puerto:', process.env.PORT))
});