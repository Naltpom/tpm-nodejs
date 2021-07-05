var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'email' : {type: String, required: true, unique: true },
	'familyName' : {type: String, required: true},
	'givenName' : {type: String, required: true},
	'password' : {type: String, required: true},
	'token' : {type: String},

	'roles' : {type: Array},
	'role_company' : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
	'role_project' : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
	'role_application' : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
	'role_component' : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
	'role_subcomponent' : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
	
	'domain' : Array,
	'companies_id' : [{ type: Schema.Types.ObjectId, ref: 'Company' }],
	'createdBy' : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    'updatedBy' : { type: Schema.Types.ObjectId, ref: 'User', required: true }

},{ timestamps: true }).plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
