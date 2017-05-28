var express = require('express');
var passport = require('passport');
const config = require('../config/index');
var router = express.Router();


//login page- redirect the page to chat if user is already logged-in
router.get('/login/:clientId', function(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/restricted/chat');
	}else{
		res.locals.message = req.flash('error');
		res.locals.clientId= req.params.clientId;
	  	res.render('login');
	}
});



router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
    	return next(err); 
    }
    if (!user) {
      //authentication unsuccessful
     return res.redirect('/login/'+req.body.clientId); 
 	}
  //authentication success and tries to login
    req.logIn(user, function(err) {
      	if (err) {
    	   return next(err); 
   		}
      return res.redirect('/restricted/chat');
    });
  })(req, res, next);
});


//logout request
router.get('/logout', passport.authenticationMiddleware(),  function(req, res) {
	var clientId = req.user.clientId;
	req.session.destroy();
	res.redirect('/login/'+clientId);
});

//unauthorized request
router.get('/unauthorized', function(req, res) {
	res.render('unauthorized');
});





module.exports = router;
