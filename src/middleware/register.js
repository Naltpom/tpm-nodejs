const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var UserModel = require('../models/user.model');

/**
 * userController.register()
 */
module.exports =  (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        var user = new UserModel({
            email : req.body.email,
            password : hash,
            familyName : req.body.familyName,
            givenName : req.body.givenName,
            token : req.body.token,

            roles : ["ROLE_USER"],
            role_company : [],
            role_project : [],
            role_application : [],
            role_component : [],
            role_subcomponent : [],
            
            domain : req.body.domain,
            companies_id : req.body.companies_id ?? [],
        });
        user.createdBy = user._id;
        user.updatedBy = user._id;

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
        });
    })
}

