var express = require('express');
var Faye = require("faye");
const passport = require('passport');
const nodemailer = require('nodemailer');
const config = require('../config/index');
var router = express.Router();


router.get('/chat', passport.authenticationMiddleware(), function(req, res, next) {
	res.locals.user = req.user;

	res.render('chat');
});

router.get('/getChatHistory', passport.authenticationMiddleware(), function(req, res, next) {
	var user = req.user;
	var guestId = user.guestId;
	//call hotel api and get chat history
	var response = {
		"history":[
		{
			"user":"",
			"time":"",
			"message":"Hi"
		},
		{
			"user":"",
			"time":"",
			"message":"How are you?"
		}
		]
	}
	res.send(response);
});

let transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
        user: config.mail.email,
        pass: config.mail.password
    }
});

let mailOptions = {
    from: config.mail.email,
    subject: config.mail.subject
};


	//if client is available sent it to him else sent to his email
router.post('/sendToClient', function(req, res, next) {
	var fayeClient = req.app.locals.fayeClient;
	var user = req.body.user;
	var channel = "/" + user.guestId;

	var map = req.app.locals.subscriptionMap;
	if(map.has(channel)){
			var pub = fayeClient.publish(channel,{
			msg: req.body.message
		});
		pub.then(function() {
	 	 	res.sendStatus(200);
		}, function(error) {
	  		res.sendStatus(400);
		});
	}else{
		mailOptions.to = user.emailId;
		mailOptions.text = req.body.message;
		mailOptions.html = '<b>'+req.body.message+'</b>';
		transporter.sendMail(mailOptions, function(error, info) {
		    if (error) {
		       res.sendStatus(400);
		    }
		    res.sendStatus(200);
		});
	}
});


router.post('/sendToServer', passport.authenticationMiddleware(), function(req, res, next) {
	console.log("User:" + req.user);
	console.log("Message:" + req.body.message);
	//send to server

	mailOptions.to = config.serverMail;
	mailOptions.text = 'Message received from user'+req.user.name.firstName +' : '+req.body.message;
	mailOptions.html = '<b>'+'Message received from user '+req.user.name.firstName +' : '+req.body.message+'</b>';
	transporter.sendMail(mailOptions, function(error, info) {
	    if (error) {
	       res.sendStatus(400);
	    }
	    res.sendStatus(200);
	});

	res.sendStatus(200);
});




module.exports = router;
