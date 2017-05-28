const config = {}

config.mongo= {
	"url": "mongodb://root:root@chat-shard-00-00-lf64q.mongodb.net:27017,chat-shard-00-01-lf64q.mongodb.net:27017,chat-shard-00-02-lf64q.mongodb.net:27017/chat?ssl=true&replicaSet=chat-shard-0&authSource=admin",
	"secret": "this is my secret key"
}

config.mail={
	"service":"gmail",
	"email":"snitesh91@gmail.com",
	"password":"18sep1991",
	"subject": "Conversation"
}

config.serverMail = 'deepak.sharma1386@gmail.com'

config.PORT= process.env.PORT || '80';

module.exports = config
