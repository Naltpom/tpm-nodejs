var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var subcomponentSchema = new Schema({
    'title': { type: String },
    'description': { type: String },
    'component' : { type: Schema.Types.ObjectId, ref: 'Component' },
	'createdBy' : {type: Schema.Types.ObjectId,ref: 'User'},
	'updatedBy' : {type: Schema.Types.ObjectId,ref: 'User'},
},{ timestamps: true });

module.exports = mongoose.model('Subcomponent', subcomponentSchema);