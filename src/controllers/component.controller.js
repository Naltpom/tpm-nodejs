const jwt = require('jsonwebtoken');
var ComponentModel = require('../models/component.model');
var ApplicationModel = require('../models/application.model');
var RoleModel = require('../models/role.model');
var UserModel = require('../models/user.model');

/**
 * component.controller.getAllComponent()
 */
exports.getAllComponent = (req, res, next) => {
    ComponentModel
        .find()
        .populate({
            path: 'application', 
            populate : {
                path: 'project',  
                populate : {
                    path: 'company',   
                }
            }
        })
        .populate({path: 'subcomponents', model: 'Subcomponent'})
        .exec()
        .then( component => {
            return res.status(200).json({component});
        })
        .catch(err => res.status(400).json({ message: 'Error when getting components.', error: err }))
}

/**
 * component.controller.getOneComponent()
 */
 exports.getOneComponent = (req, res, next) => {
    ComponentModel
        .findOne({ _id: req.params.id })
        .populate({
            path: 'application', 
            populate : {
                path: 'project',  
                populate : {
                    path: 'company',   
                }
            }
        })
        .populate({path: 'subcomponents', model: 'Subcomponent'})
        .exec()
        .then( component => {
            return res.status(200).json({component});
        })
        .catch(err => res.status(404).json({ message: 'Error when getting component.', error: err }))
}

/**
 * component.controller.deleteComponent()
 */
 exports.deleteComponent = (req, res, next) => {
    ComponentModel
        .findOne({ _id: req.params.id })
        .then( component => {
            if (component !== null) {
                ComponentModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'component supprimé'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                return res.status(404).json({ message: 'component non trouvé' })
            }
        })
        .catch(err => res.status(404).json({ message: 'Error when getting components.', error: err }))
}

/**
 * component.controller.createComponent()
 */
exports.createComponent = (req, res, next) => {
    const items = req.body.component;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));


    // 1 ---------------------
    const component = new ComponentModel({
        title: items.title,
        description: items.description,
        application: items.application,
        subcomponents: items.subcomponents ?? [],
        created_at: Date.now(),
        update_at: Date.now(),
    });
    component._id = items._id ?? component._id;
    component.createdBy = decoded["userId"];
    component.updatedBy = decoded["userId"];    

    const saveComponentPromise = component.save().then(component => component).catch(error => error)

    // 2 ---------------------
    const componentRoleAdmin = new RoleModel({
        ressource: component._id,
        role: "COMPONENT_ADMIN"
    })

    const saveComponentRoleAdminPromise = componentRoleAdmin.save().then(role => role).catch(error => error)

    // 3 ---------------------
    const componentRoles = ["COMPONENT_MODERATEUR", "COMPONENT_USER"]
    const roles = [];
    for (i = 0; i < componentRoles.length ; i++) { 
        roles[i] = {
            ressource: component._id,
            role: componentRoles[i]
        }
    }

    const saveOtherComponentRolesPromise = RoleModel.insertMany(roles).then(roles => roles).catch(error => error)


    // 4 ---------------------
    const findApplicationPromise = ApplicationModel.findOne({_id: component.application})
        .then(application => application)
        .catch(error => error)


    // 5 ---------------------
    const getAdminApplicationRolePromise = RoleModel.findOne({ressource: component.application, role: "APPLICATION_ADMIN"})
        .then(role => role)
        .catch(error => error)

    /**
     *  1
     *  2  
     *  3
     *  4
     *  5
     */
     Promise.all([saveComponentPromise, saveComponentRoleAdminPromise, saveOtherComponentRolesPromise, findApplicationPromise, getAdminApplicationRolePromise])
     .then(data => {
        const component = data[0]
        const componentAdminRole = data[1]
        const otherComponentRole = data[2]
        const application = data[3]
        const applicationAdminRole = data[4]

        // on ajoute le role admin aux admin de l'application
        const addComponentAdminRoleToApplicationAdminUser = UserModel.updateMany({role_application: applicationAdminRole._id}, {$addToSet :{role_component: componentAdminRole._id }})
            .then(users => users)
            .catch(error => error)

        // on ajoute le role admin aux createur de component
        const addComponentAdminRoleToTheCreator = UserModel.updateMany({_id: decoded["userId"]}, {$addToSet :{role_component: componentAdminRole._id }})
            .then(users => users)
            .catch(error => error)

        // on ajoute le component a l'application
        const addComponentToApplication = ApplicationModel.updateOne({_id: application._id}, {$addToSet: {components: component}})

        Promise.all([addComponentAdminRoleToApplicationAdminUser, addComponentAdminRoleToTheCreator, addComponentToApplication])
            .then(data2 => res.status(200).json({data2, data}))
            .catch(error => res.status(400).json({error: error}))
    })
    .catch(error => res.status(400).json({error: error}))


};



/**
 * component.controller.modifyComponent()
 */
 exports.modifyComponent = (req, res, next) => {
    const items = req.body.component;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
    ComponentModel
        .findOne({ _id: req.params.id })
        .then( component => {

            const newItem = {
                title: items.title ?? component.title,
                description: items.description ?? component.description,
                application: items.application ?? component.application,
                subcomponents: items.subcomponents ?? component.subcomponents,
                update_at: Date.now(),
            }
            newItem.updatedBy = decoded["userId"]; 

            ComponentModel.updateOne({ _id: req.params.id }, newItem)
                .then((component) => res.status(200).json({message : 'component modifié', component: component}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(err => res.status(404).json({ message: 'Error when getting component.', error: err }))
}