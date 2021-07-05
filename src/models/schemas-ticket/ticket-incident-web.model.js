var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ticketIncedentWebSchema = new Schema({
	'ticket' : {type: Schema.Types.ObjectId,ref: 'Ticket'},
	'image_file' : [{type: Schema.Types.ObjectId,ref: 'File'}],
	'owner' : {type: Schema.Types.ObjectId,ref: 'User'},
	'url' : {type: String},
	'os' : {type: String},
	'screen_size' : {type: String},
	'browser' : {type: String},
});

module.exports = mongoose.model('TicketIncidentWeb', ticketIncedentWebSchema);