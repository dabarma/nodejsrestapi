var jwt    = require('jsonwebtoken');
var mongoose  = require('mongoose');
var config = require('./config'); 
var User   = require('./app/models/user');

mongoose.connect(config.database);

function authenticate(req, res) {

    // find the user
    User.findOne({
      name: req.body.name
    }, function(err, user) {
  
      if (err) throw err;
  
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
  
        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
  
      // if user is found and password is right
      // create a token with only our given payload
      // we don't want to pass in the entire user since that has the password
      const payload = {
        admin: user.admin ,
        user: "pepe" // aqui habria que recuperar el idusuario real
      };
          var token = jwt.sign(payload, config.secret, {
              expiresIn: 1440 // expires in 24 hours
          });
  
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }   
  
      }
  
    });
};

function VerifyTokenfunction(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
  
    }
  };

function InitTestUserfunction(req, res) {

    // create a sample user
    var nick = new User({ 
      name: 'Nick Cerminara', 
      password: 'password',
      admin: true 
    });
  
    // save the sample user
    nick.save(function(err) {
      if (err) throw err;
  
      console.log('User saved successfully');
      res.json({ success: true });
    });
};

function GetUsers(req, res) {
    User.find({}, function(err, users) {
      res.json(users);
    });
  };

module.exports.authenticate = authenticate;
module.exports.verifytoken = VerifyTokenfunction;
module.exports.inittestuser = InitTestUserfunction; //Estas funciones no iria aqui, pero lo dejo para pruebas
module.exports.getusers = GetUsers; //Estas funciones no iria aqui, pero lo dejo para pruebas