var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Configração do Usuário no Mongo
module.exports = mongoose.model('User', new Schema({ 
	name: String, 
	password: String, 
	admin: Boolean 
}));