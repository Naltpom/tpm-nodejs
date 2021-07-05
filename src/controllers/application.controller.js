const jwt = require('jsonwebtoken');
var ApplicationModel = require('../models/application.model');
var ProjectModel = require('../models/project.model');
var RoleModel = require('../models/role.model');
var UserModel = require('../models/user.model');

/**
 * application.controller.getAllApplication()
 */
exports.getAllApplication = (req, res, next) => {
    ApplicationModel
        .find()
        .populate({
            path: 'project', 
            populate : {
                path: 'company',  
            }
        })
        .populate({path: 'components', model: 'Component', populate : {path: 'subcomponents', model: 'Subcomponent'}})
        .exec()
        .then( application => {
            return res.status(200).json({application});
        })
        .catch(err => res.status(400).json({ message: 'Error when getting applications.', error: err }))
}

/**
 * application.controller.getOneApplication()
 */
 exports.getOneApplication = (req, res, next) => {
    ApplicationModel
        .findOne({ _id: req.params.id })
        .populate({
            path: 'project', 
            populate : {
                path: 'company',  
            }
        })
        .populate({path: 'components', model: 'Component', populate : {path: 'subcomponents', model: 'Subcomponent'}})
        .exec()
        .then( application => {
            return res.status(200).json({application});
        })
        .catch(err => res.status(404).json({ message: 'Error when getting application.', error: err }))
}

/**
 * application.controller.deleteApplication()
 */
 exports.deleteApplication = (req, res, next) => {
    ApplicationModel
        .findOne({ _id: req.params.id })
        .then( application => {
            if (application !== null) {
                ApplicationModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'application supprimé'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                return res.status(404).json({ message: 'application non trouvé' })
            }
        })
        .catch(err => res.status(404).json({ message: 'Error when getting applications.', error: err }))
}

/**
 * application.controller.createApplication()
 */
exports.createApplication = (req, res, next) => {
    const items = req.body.application;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));


    // 1 ---------------------
    const application = new ApplicationModel({
        title: items.title,
        description: items.description,
        project: items.project,
        components: items.components ?? [],
        created_at: Date.now(),
        update_at: Date.now(),
    });
    application._id = items._id ?? application._id;
    application.createdBy = decoded["userId"];
    application.updatedBy = decoded["userId"];    

    const saveApplicationPromise = application.save().then(application => application).catch(error => error)

    // 2 ---------------------
    const applicationRoleAdmin = new RoleModel({
        ressource: application._id,
        role: "APPLICATION_ADMIN"
    })

    const saveAplicationRoleAdminPromise = applicationRoleAdmin.save().then(role => role).catch(error => error)

    // 3 ---------------------
    const applicationRoles = ["APPLICATION_MODERATEUR", "APPLICATION_USER"]
    const roles = [];
    for (i = 0; i < applicationRoles.length ; i++) { 
        roles[i] = {
            ressource: application._id,
            role: applicationRoles[i]
        }
    }

    const saveOtherApplicationRolesPromise = RoleModel.insertMany(roles).then(roles => roles).catch(error => error)


    // 4 ---------------------
    const findProjectPromise = ProjectModel.findOne({_id: application.project})
        .then(project => project)
        .catch(error => error)


    // 5 ---------------------
    const getAdminProjectRolePromise = RoleModel.findOne({ressource: application.project, role: "PROJECT_ADMIN"})
        .then(role => role)
        .catch(error => error)

    /**
     *  1
     *  2  
     *  3
     *  4
     *  5
     */
     Promise.all([saveApplicationPromise, saveAplicationRoleAdminPromise, saveOtherApplicationRolesPromise, findProjectPromise, getAdminProjectRolePromise])
     .then(data => {
         const application = data[0]
         const applicationAdminRole = data[1]
         const otherApplicationtRole = data[2]
         const project = data[3]
         const projectAdminRole = data[4]

         // on ajoute le role admin aux admin du projet
         const addApplicationAdminRoleToProjectAdminUser = UserModel.updateMany({role_project: projectAdminRole._id}, {$addToSet :{role_application: applicationAdminRole._id }})
             .then(users => users)
             .catch(error => error)

         // on ajoute le role admin aux createur de application
         const addApplicationAdminRoleToTheCreator = UserModel.updateMany({_id: decoded["userId"]}, {$addToSet :{role_application: applicationAdminRole._id }})
             .then(users => users)
             .catch(error => error)

         // on ajoute le application au project
         const addApplicationToProject = ProjectModel.updateOne({_id: project._id}, {$addToSet: {applications: application}})

         Promise.all([addApplicationAdminRoleToProjectAdminUser, addApplicationAdminRoleToTheCreator, addApplicationToProject])
             .then(data2 => res.status(200).json({data2, data}))
             .catch(error => res.status(400).json({error: error}))
     })
     .catch(error => res.status(400).json({error: error}))

};



/**
 * application.controller.modifyApplication()
 */
 exports.modifyApplication = (req, res, next) => {
    const items = req.body.application;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
    ApplicationModel
        .findOne({ _id: req.params.id })
        .then( application => {

            const newItem = {                    
                title: items.title,
                description: items.description,
                project: application.project,
                created_at: application.created_at,
                update_at: Date.now(),
                createdBy: application.createdBy
            };
            newItem.updatedBy = decoded["userId"];    

            if (application.project !== items.project) {
                ProjectModel.findOne({_id: items.project}).then(() => {

                    newItem.project = items.project;
                    ApplicationModel.updateOne({ _id: req.params.id }, newItem)
                        .then((application) => res.status(200).json({message : 'Application modifié', application: application}))
                        .catch(error => res.status(400).json({ error }));

                }).catch(error => res.status(404).json({error, message: 'project not found'}))

            } else {
                ApplicationModel.updateOne({ _id: req.params.id }, newItem)
                    .then((application) => res.status(200).json({message : 'Application modifié', application: application}))
                    .catch(error => res.status(400).json({ error }));
            }

        })
        .catch(err => res.status(404).json({ message: 'Error when getting application.', error: err }))
}