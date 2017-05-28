const config = {}

config.mongo= {
	"url": "mongodb://localhost:27017/chat",
	"secret": "this is my secret key"
}

config.mail={
	"service":"gmail",
	"email":"snitesh91@gmail.com",
	"password":"18sep1991",
	"subject": "Conversation"
}

config.PORT= process.env.PORT || '3000';

module.exports = config
