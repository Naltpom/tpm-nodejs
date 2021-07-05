var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ticketFeedbackSchema = new Schema({
	'image_file' : [{type: Schema.Types.ObjectId,ref: 'File'}],
	'ticket' : {type: Schema.Types.ObjectId,ref: 'Ticket'},
	'message' : {type: String},
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('TicketFeedback', ticketFeedbackSchema);