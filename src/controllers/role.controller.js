const jwt = require('jsonwebtoken');
var RoleModel = require('../models/role.model');

/**
 * companyController.js
 *
 * @description :: Server-side logic for managing companys.
 */
module.exports = {

    /**
     * companyController.list()
     */
    list: function (req, res) {
        RoleModel.find().populate({ path: 'createdBy', select: 'familyName' }).exec().then( role => {
            return res.status(200).json({role});
        })
        .catch(err => res.status(500).json({ message: 'Error when getting role.', error: err }))
        ;
    },

    /**
     * companyController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RoleModel.findOne({_id: id})
        .populate({ path: 'createdBy' }).exec()
        .then(role => {return res.status(200).json({role})})
        .catch(err => {return res.status(500).json({err})})
    },

    /**
     * companyController.create()
     */
    create: function (req, res) {
        const item = req.body.role;
        // var decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
        
        var role = new RoleModel({
			ressource : item.ressource,
			role : item.role,
        });

        role.save(role).then(role => {
            return res.status(201).json({role})
        })
        .catch(err => res.status(405).json({err}))
    },

    /**
     * companyController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RoleModel.findOne({_id: id}, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting role',
                    error: err
                });
            }

            if (!role) {
                return res.status(404).json({
                    message: 'No such role'
                });
            }

            role.name = req.body.name ? req.body.name : role.name;
			role.createdBy = req.body.createdBy ? req.body.createdBy : role.createdBy;
			role.updatedBy = req.body.updatedBy ? req.body.updatedBy : role.updatedBy;
			role.updatedAt = Date.now();
			
            role.save(function (err, role) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating role.',
                        error: err
                    });
                }

                return res.json(role);
            });
        });
    },

    /**
     * companyController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RoleModel.findByIdAndRemove(id, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the role.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
