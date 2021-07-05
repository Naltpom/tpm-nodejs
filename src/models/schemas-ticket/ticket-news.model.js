var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ticketNewsSchema = new Schema({
	'ticket' : {type: Schema.Types.ObjectId,ref: 'Ticket'},
	'image_file' : [{type: Schema.Types.ObjectId,ref: 'File'}],
});

module.exports = mongoose.model('TicketNews', ticketNewsSchema);