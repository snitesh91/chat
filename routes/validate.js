var express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/index');
var router = express.Router();

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/unauthorized');
    }
  }


  passport.serializeUser(function (user, cb) {
    cb(null, user)
  });

  passport.deserializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'roomNo',
    passwordField: 'lastName',
    passReqToCallback : true
    },
    function(req, username, password, done) {
      validateUser(req, username, password, function(err, user){
    		if (!user) {
              var info = 'Invalid login details';
          		return done(null, false, info);
       	 	}else{
       	 	return done(null, user);
         }
    	})
    }
  ));


  function validateUser (request, username, password, callback){
  	//call hotel api with roomNo, lastName and clientid and a saved password to authenticate the request
    //console.log("clientId: " + request.body.clientId);//hardcoded on login page
  	var response = {
  			"validUser":true,
  			"user":{
          "guestId":"12345",
          "clientId": "1001",
  				"name":{
            "firstName": "nitesh",
            "lastName" : "singla"
          },
          "roomNo" : "123",
          "emailId": "snitesh91@gmail.com"
          }
  	};

  	if(response.validUser==true){
        console.log('validation doce');
  		  callback(null, response.user);
  	 }else{
  	     return callback(null);
      }
    }

    passport.authenticationMiddleware = authenticationMiddleware;



module.exports = router;
