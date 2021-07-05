var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var applicationSchema = new Schema({
    'title': { type: String },
    'description': { type: String },
    'project' : { type: Schema.Types.ObjectId, ref: 'Project' },
    'components' : [{type: Schema.Types.ObjectId, ref: 'Component'}],
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);