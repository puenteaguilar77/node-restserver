require('./config/config');
const express = require('express');
const mongoose = require('mongoose');


const app = express();
const bodyParser = require('body-parser');
const colors = require('colors');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,

    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },

    (err, res) => {

        if (err) throw err;
        console.log(colors.blue('Base de datos ONLINE!!!'))

    });

app.listen(process.env.PORT, () => {
    console.log(colors.blue('escuchando en el puerto:', process.env.PORT))
});