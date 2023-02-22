const express= require('express');
const app = express();
app.use(express.json());

const morgan =require('morgan');
//configuraciones
app.set('puerto' , process.env.PORT || 3300);
// middlewares
app.use(morgan('dev'));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//  rutas para mi aplicacion
app.use(require('./router/router'))
// inicia el servidor NODE
app.listen(app.get('puerto'), ()=>{
    console.log('El servidor corriendo en el puerto',app.get('puerto') )
})