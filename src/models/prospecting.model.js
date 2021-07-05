var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var prospectingSchema = new Schema({
    'token': { type: String },
    'email': { type: String },
    'company' : { type: Schema.Types.ObjectId, ref: 'Company' },
    'host' : { type: Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

module.exports = mongoose.model('Prospecting', prospectingSchema);