const ROLES = require('./enums/role.enum');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var roleSchema = new Schema({
    'ressource': { type: String },
    'role': {type: String, enum: ROLES}
},{ timestamps: true });

module.exports = mongoose.model('Role', roleSchema);