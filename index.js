const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Rutas
const inicioRouter = require('./routes/Inicio');
const usuarioRouter = require('./routes/User');
const signUpRouter = require('./routes/signUp');
const locationRouter = require('./routes/location');
const productRouter = require('./routes/product');

const app = express();

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Routes
app.use('/', inicioRouter);
app.use('/user', usuarioRouter);
app.use('/sign-up', signUpRouter);
app.use('/location', locationRouter);
app.use('/location', locationRouter);
app.use('/product', productRouter);


//Starting Server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})