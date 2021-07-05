const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var UserModel = require('../models/user.model');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find().populate({path: 'createdBy', select: 'createdBy familyName', populate : {path: 'createdBy',  select: 'familyName'}}).exec().then( users => {
            return res.status(200).json({users});
        })
        .catch(err => res.status(500).json({ message: 'Error when getting user.', error: err }))
        ;
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },



    /**
     * userController.update()
     */
    update: function (req, res) {
        var decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));

        UserModel.findOne({ _id: req.params.id })
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {

                        var upUser = {
                            email : req.body.email ? req.body.email : user.email,
                            familyName : req.body.familyName ? req.body.familyName : user.familyName,
                            givenName : req.body.givenName ? req.body.givenName : user.givenName,
                            token : req.body.token ? req.body.token : user.token,
                            roles : req.body.roles ? req.body.roles : user.roles,
                            role_company : req.body.role_company ? req.body.role_company : user.role_company,
                            role_project : req.body.role_project ? req.body.role_project : user.role_project,
                            role_application : req.body.role_application ? req.body.role_application : user.role_application,
                            role_component : req.body.role_component ? req.body.role_component : user.role_component,
                            role_subcomponent : req.body.role_subcomponent ? req.body.role_subcomponent : user.role_subcomponent,
                            domain : req.body.domain ? req.body.domain : user.domain,
                            companies_id : req.body.companies_id ?? [],
                        };
                        upUser.createdBy = user._id;
                        upUser.updatedBy = decoded["userId"];
                        upUser.updatedAt = Date.now();
                        

                        if (!valid) {
                            upUser.password = hash;
                        } else {
                            upUser.password = user.password;
                        }

                        UserModel.updateOne({ _id: req.params.id }, upUser)
                            .then((user) => res.status(200).json({message : 'User modifié', user: user}))
                            .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));

            })
            .catch(error => res.status(500).json({ error }));
        
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
