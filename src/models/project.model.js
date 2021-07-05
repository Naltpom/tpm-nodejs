var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var projectSchema = new Schema({
    'title': { type: String },
    'description': { type: String },
    'company' : { type: Schema.Types.ObjectId, ref: 'Company' },
    'applications' : [{ type: Schema.Types.ObjectId, ref: 'Application' }],
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('Project', projectSchema);