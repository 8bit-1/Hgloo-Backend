const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const serviceAccount = require("./enviroment/hgloo-app-firebase-adminsdk-y9ri1-c447f95a4f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//Rutas
const inicioRouter = require('./routes/Inicio');
const usuarioRouter = require('./routes/User');
const signUpRouter = require('./routes/signUp');
const locationRouter = require('./routes/location');
const complaintRouter = require('./routes/Complaint');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/categories');
const commentaryRouter = require('./routes/Commentary');
const profileRouter = require('./routes/Profile');
const reportsRouter = require('./routes/Reports');
const coinRouter = require('./routes/coin');
const genreRouter = require('./routes/genre');
const qualificationRouter = require('./routes/Qualification');
const conditionRouter = require('./routes/Condition');
const publicityRouter = require('./routes/Publicity');
const adminRouter = require('./routes/Administrator');
const emailsRouter = require('./routes/email');
const configHgloo = require('./services/triggers-actions');
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
app.use('/commentary', commentaryRouter)
app.use('/complaint', complaintRouter);

app.use('/categories', categoryRouter);
app.use('/profile', profileRouter);
app.use('/reports', reportsRouter);
app.use('/coin', coinRouter);
app.use('/genre', genreRouter);
app.use('/qualification', qualificationRouter);
app.use('/condition', conditionRouter);
app.use('/publicity', publicityRouter);
app.use('/admin', adminRouter);
app.use('/email', emailsRouter);
//Starting Server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})