var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var componentSchema = new Schema({
    'title': { type: String },
    'description': { type: String },
    'application' : { type: Schema.Types.ObjectId, ref: 'Application' },
    'subcomponents' : [{type: Schema.Types.ObjectId, ref: 'Subcomposant'}],
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('Component', componentSchema);