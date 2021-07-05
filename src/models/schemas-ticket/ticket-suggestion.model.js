var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ticketSuggestionSchema = new Schema({
	'ticket' : {type: Schema.Types.ObjectId,ref: 'Ticket'},
	'image_file' : [{type: Schema.Types.ObjectId,ref: 'File'}],
});

module.exports = mongoose.model('TicketSuggestion', ticketSuggestionSchema);