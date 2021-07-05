var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var companySchema = new Schema({
    'title': { type: String },
    'description': { type: String },
    'projects' : [{ type: Schema.Types.ObjectId, ref: 'Project' }],
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('Company', companySchema);
