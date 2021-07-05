const jwt = require('jsonwebtoken');
var SubcomponentModel = require('../models/subcomponent.model');
var ComponentModel = require('../models/component.model');
var RoleModel = require('../models/role.model');
var UserModel = require('../models/user.model');

/**
 * subcomponent.controller.getAllSubcomponent()
 */
exports.getAllSubcomponent = (req, res, next) => {
    SubcomponentModel
        .find()
        .populate({
            path: 'component', 
            populate : {
                path: 'application',  
                populate : {
                    path: 'project',   
                    populate : {
                        path: 'company',   
                    }
                }
            }
        })
        .exec()
        .then( subcomponent => {
            return res.status(200).json({subcomponent});
        })
        .catch(err => res.status(400).json({ message: 'Error when getting subcomponents.', error: err }))
}

/**
 * subcomponent.controller.getOneSubcomponent()
 */
 exports.getOneSubcomponent = (req, res, next) => {
    SubcomponentModel
        .findOne({ _id: req.params.id })
        .populate({
            path: 'component', 
            populate : {
                path: 'application',  
                populate : {
                    path: 'project',   
                    populate : {
                        path: 'company',   
                    }
                }
            }
        })
        .exec()
        .then( subcomponent => {
            return res.status(200).json({subcomponent});
        })
        .catch(err => res.status(404).json({ message: 'Error when getting subcomponent.', error: err }))
}

/**
 * subcomponent.controller.deleteSubcomponent()
 */
 exports.deleteSubcomponent = (req, res, next) => {
    SubcomponentModel
        .findOne({ _id: req.params.id })
        .then( subcomponent => {
            if (subcomponent !== null) {
                SubcomponentModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'subcomponent supprimé'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                return res.status(404).json({ message: 'subcomponent non trouvé' })
            }
        })
        .catch(err => res.status(404).json({ message: 'Error when getting subcomponent.', error: err }))
}

/**
 * subcomponent.controller.createSubcomponent()
 */
exports.createSubcomponent = (req, res, next) => {
    const items = req.body.subcomponent;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));

    // 1 ---------------------
    const subcomponent = new SubcomponentModel({
        title: items.title,
        description: items.description,
        component: items.component,
        created_at: Date.now(),
        update_at: Date.now(),
    });
    subcomponent._id = items._id ?? subcomponent._id;
    subcomponent.createdBy = decoded["userId"];
    subcomponent.updatedBy = decoded["userId"];    

    const saveSubComponentPromise = subcomponent.save().then(subcomponent => subcomponent).catch(error => error)

    // 2 ---------------------
    const subcomponentRoleAdmin = new RoleModel({
        ressource: subcomponent._id,
        role: "SUBCOMPONENT_ADMIN"
    })

    const saveSubComponentRoleAdminPromise = subcomponentRoleAdmin.save().then(role => role).catch(error => error)


    // 3 ---------------------
    const subcomponentRoles = ["SUBCOMPONENT_MODERATEUR", "SUBCOMPONENT_USER"]
    const roles = [];
    for (i = 0; i < subcomponentRoles.length ; i++) { 
        roles[i] = {
            ressource: subcomponent._id,
            role: subcomponentRoles[i]
        }
    }

    const saveOtherSubComponentRolesPromise = RoleModel.insertMany(roles).then(roles => roles).catch(error => error)


    // 4 ---------------------
    const findComponentPromise = ComponentModel.findOne({_id: subcomponent.component})
        .then(component => component)
        .catch(error => error)

    // 5 ---------------------
    const getAdminComponentRolePromise = RoleModel.findOne({ressource: subcomponent.component, role: "COMPONENT_ADMIN"})
        .then(role => role)
        .catch(error => error)

    /**
     *  1
     *  2  
     *  3
     *  4
     *  5
     */
     Promise.all([saveSubComponentPromise, saveSubComponentRoleAdminPromise, saveOtherSubComponentRolesPromise, findComponentPromise, getAdminComponentRolePromise])
     .then(data => {
        const subcomponent = data[0]
        const subcomponentAdminRole = data[1]
        const otherSubComponentRole = data[2]
        const component = data[3]
        const componentAdminRole = data[4]

        // on ajoute le role admin aux admin de l'Component
        const addSubComponentAdminRoleToComponentAdminUser = UserModel.updateMany({role_component: componentAdminRole._id}, {$addToSet :{role_subcomponent: subcomponentAdminRole._id }})
            .then(users => users)
            .catch(error => error)

        // on ajoute le role admin aux createur de component
        const addSubComponentAdminRoleToTheCreator = UserModel.updateMany({_id: decoded["userId"]}, {$addToSet :{role_subcomponent: subcomponentAdminRole._id }})
            .then(users => users)
            .catch(error => error)

        // on ajoute le component a l'application
        const addSubComponentToComponent = ComponentModel.updateOne({_id: component._id}, {$addToSet: {subcomponents: subcomponent}})

        Promise.all([addSubComponentAdminRoleToComponentAdminUser, addSubComponentAdminRoleToTheCreator, addSubComponentToComponent])
            .then(data2 => res.status(200).json({data2, data}))
            .catch(error => res.status(400).json({error: error}))
    })
    .catch(error => res.status(400).json({error: error}))

};



/**
 * subcomponent.controller.modifySubcomponent()
 */
 exports.modifySubcomponent = (req, res, next) => {
    const items = req.body.subcomponent;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
    SubcomponentModel
        .findOne({ _id: req.params.id })
        .then( subcomponent => {

            const newItem = {
                title: items.title ?? subcomponent.title,
                description: items.description ?? subcomponent.description,
                application: items.application ?? subcomponent.application,
                subcomponents: items.subcomponents ?? subcomponent.subcomponents,
                update_at: Date.now(),
            }
            newItem.updatedBy = decoded["userId"]; 

            SubcomponentModel.updateOne({ _id: req.params.id }, newItem)
                .then((subcomponent) => res.status(200).json({message : 'subcomponent modifié', subcomponent: subcomponent}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(err => res.status(404).json({ message: 'Error when getting subcomponent.', error: err }))
}