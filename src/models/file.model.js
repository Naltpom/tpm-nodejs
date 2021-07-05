var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fileSchema = new Schema({
    'path': { type: String },
    'type': { type: String },
},{ timestamps: true });

module.exports = mongoose.model('File', fileSchema);