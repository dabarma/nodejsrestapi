var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var authentication = require('./authentication');

// =======================
// configuracion =========
// =======================
var port = process.env.PORT || 8080; // puerto escucha servidor

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', authentication.inittestuser);

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
//importante: como se ha definido antes de poner el use de verificacion de token, la verificacion no pasara para esta ruta
apiRoutes.post('/authenticate', authentication.authenticate);

// route middleware to verify a token
apiRoutes.use(authentication.verifytoken);

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', authentication.getusers);   

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Arrancado servidor en http://localhost:' + port);