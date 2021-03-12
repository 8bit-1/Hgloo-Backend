const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Rutas
const inicioRouter = require('./routes/Inicio')
const usuarioRouter = require('./routes/Usuario')

const app = express();

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Routes
app.use('/', inicioRouter);
app.use('/Usuario', usuarioRouter);

//Starting Server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})