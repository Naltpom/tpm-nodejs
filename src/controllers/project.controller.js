const jwt = require('jsonwebtoken');
var ProjectModel = require('../models/project.model');
var CompanyModel = require('../models/company.model');
var RoleModel = require('../models/role.model');
var UserModel = require('../models/user.model');


/**
 * project.controller.getAllProject()
 */
exports.getAllProject = (req, res, next) => {
    ProjectModel
        .find()
        .populate({
            path: 'company', 
        })
        .populate({path: 'applications', model: 'Application', populate : {path: 'components', model: 'Component', populate : {path: 'subcomponents', model: 'Subcomponent'}}})
        .exec()
        .then( project => {
            return res.status(200).json({project});
        })
        .catch(err => res.status(400).json({ message: 'Error when getting projects.', error: err }))
}

/**
 * project.controller.getOneProject()
 */
 exports.getOneProject = (req, res, next) => {
    ProjectModel
        .findOne({ _id: req.params.id })
        .populate({
            path: 'company', 
        })
        .populate({path: 'applications', model: 'Application', populate : {path: 'components', model: 'Component', populate : {path: 'subcomponents', model: 'Subcomponent'}}})
        .exec()
        .then( project => {
            return res.status(200).json({project});
        })
        .catch(err => res.status(404).json({ message: 'Error when getting project.', error: err }))
}

/**
 * project.controller.deleteProject()
 */
 exports.deleteProject = (req, res, next) => {
    ProjectModel
        .findOne({ _id: req.params.id })
        .then( project => {
            if (project !== null) {
                ProjectModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'project supprimé'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                return res.status(404).json({ message: 'project non trouvé' })
            }
        })
        .catch(err => res.status(404).json({ message: 'Error when getting projects.', error: err }))
}

/**
 * project.controller.createProject()
 */
exports.createProject = (req, res, next) => {
    const items = req.body.project;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
    
    
    // 1 ---------------------
    const project = new ProjectModel({
        title: items.title,
        description: items.description,
        company: items.company,
        applications: items.applications ?? [],
        created_at: Date.now(),
        update_at: Date.now(),
    });
    project._id = items._id ?? project._id;
    project.createdBy = decoded["userId"];
    project.updatedBy = decoded["userId"];    

    const saveProjectPromise = project.save().then(project => project).catch(error => error)

    // 2 ---------------------
    const projectRoleAdmin = new RoleModel({
        ressource: project._id,
        role: "PROJECT_ADMIN"
    })

    const saveProjectRoleAdminPromise = projectRoleAdmin.save().then(role => role).catch(error => error)

    // 3 ---------------------
    const projectRoles = ["PROJECT_MODERATEUR", "PROJECT_USER"]
    const roles = [];
    for (i = 0; i < projectRoles.length ; i++) { 
        roles[i] = {
            ressource: project._id,
            role: projectRoles[i]
        }
    }

    const saveOtherProjectRolesPromise = RoleModel.insertMany(roles).then(roles => roles).catch(error => error)

    // 4 ---------------------
    const findCompanyPromise = CompanyModel.findOne({_id: project.company})
        .then(company => company)
        .catch(error => error)


    // 5 ---------------------
    const getAdminCompanyRolePromise = RoleModel.findOne({ressource: project.company, role: "COMPANY_ADMIN"})
        .then(role => role)
        .catch(error => error)


    /**
     *   1   PROMISE : on attend l'enregistrement du projet
     *  CONST : on crée le new rolemodel PROJECT_ADMIN 
     *   2   PROMISE : on attend le save du role
     *   3   PROMISE : on attend la créetion des autre role en insert many
     *   4   PROMISE : on attend de recup et update la company
     *   5   PROMISE : on attend la recup du role_admin de la company et on recup les user possedant se role
     */ 
    Promise.all([saveProjectPromise, saveProjectRoleAdminPromise, saveOtherProjectRolesPromise, findCompanyPromise, getAdminCompanyRolePromise])
        .then(data => {
            const project = data[0]
            const projectAdminRole = data[1]
            const otherProjectRole = data[2]
            const company = data[3]
            const companyAdminRole = data[4]

            // on ajoute le role admin aux admin du la company
            const addProjectAdminRoleToCompanyAdminUser = UserModel.updateMany({role_company: companyAdminRole._id}, {$addToSet :{role_project: projectAdminRole }})
                .then(users => users)
                .catch(error => error)

            // on ajoute le role admin aux createur du project
            const addProjectAdminRoleToTheCreator = UserModel.updateMany({_id: decoded["userId"]}, {$addToSet :{role_project: projectAdminRole }})
                .then(users => users)
                .catch(error => error)

            // on ajoute le projet a la company
            const addProjectToCompany = CompanyModel.updateOne({_id: company._id}, {$addToSet: {projects: project}})

            Promise.all([addProjectAdminRoleToCompanyAdminUser, addProjectAdminRoleToTheCreator, addProjectToCompany])
                .then(data2 => res.status(200).json({data2, data}))
                .catch(error => res.status(400).json({error: error}))
        })
        .catch(error => res.status(400).json({error: error}))
};



/**
 * project.controller.modifyProject()
 */
 exports.modifyProject = (req, res, next) => {
    const items = req.body.project;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
    ProjectModel
        .findOne({ _id: req.params.id })
        .then( project => {

            const newItem = {
                title: items.title ?? project.title,
                description: items.description ?? project.description,
                company: items.company ?? project.company,
                applications: items.applications ?? project.applications,
                update_at: Date.now(),
            }
            newItem.updatedBy = decoded["userId"]; 

            ProjectModel.updateOne({ _id: req.params.id }, newItem)
                .then((project) => res.status(200).json({message : 'project modifié', project: project}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(err => res.status(404).json({ message: 'Error when getting project.', error: err }))
}