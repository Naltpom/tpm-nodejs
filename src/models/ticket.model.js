var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ticketSchema = new Schema({
    'schema_ticket_name': { type: String },
    'schema_ticket_id': { type: String },
    'title': { type: String },
    'type': { type: String },
    'description': { type: String },
    'level_priority': { type: String },
    'status': { type: String },
    'expire_date': { type: Date },
	'ticket_feedbacks' : [{type: Schema.Types.ObjectId,ref: 'TicketFeedback'}],
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);