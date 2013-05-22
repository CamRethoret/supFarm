/*Fichier de connexion à la BDD */

var mongoose = require('mongoose');
mongoose.connect('localhost', 'supFarm');
exports.mongoose = mongoose;