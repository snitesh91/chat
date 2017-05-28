var express = require('express');
var Faye = require("faye");
const passport = require('passport');
var fayeClient = new Faye.Client('http://localhost:3000/faye');
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
	console.log('request received');
	var user = req.body.user;
	var channel = "/" + user.guestId;

	var map = req.app.locals.subscriptionMap;
	if(map.has(channel)){
			console.log('user already subscriber');
			var pub = fayeClient.publish(channel,{
			msg: req.body.message
		});
			console.log('message send to server on faye');
		pub.then(function() {
	 	 	res.sendStatus(200);
		}, function(error) {
	  		res.sendStatus(400);
		});
	}else{
		console.log('user not subscribed sending mail');
		mailOptions.to = user.emailId;
		mailOptions.text = req.body.message;
		mailOptions.html = '<b>'+req.body.message+'</b>';
		transporter.sendMail(mailOptions, function(error, info) {
			console.log('mail sending');
		    if (error) {
		       res.sendStatus(400);
		    }
		    console.log('mail send');
		    res.sendStatus(200);
		});
	}
});


router.post('/sendToServer', passport.authenticationMiddleware(), function(req, res, next) {
	console.log("User:" + req.user);
	console.log("Message:" + req.body.message);
	//send to server
	res.sendStatus(200);
});




module.exports = router;
