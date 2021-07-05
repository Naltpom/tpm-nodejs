const jwt = require('jsonwebtoken');
var CompanyModel = require('../models/company.model');
var RoleModel = require('../models/role.model');
var UserModel = require('../models/user.model');

/**
 * company.controller.getAllCompany()
 */
exports.getAllCompany = (req, res, next) => {
    CompanyModel
        .find()
        .populate({path: 'projects', model: 'Project',populate : {path: 'applications', model: 'Application', populate : {path: 'components', model: 'Component', populate : {path: 'subcomponents', model: 'Subcomponent'}}}})
        .exec()
        .then( company => {
            return res.status(200).json({company});
        })
        .catch(err => res.status(400).json({ message: 'Error when getting companys.', error: err }))
}

/**
 * company.controller.getOneCompany()
 */
 exports.getOneCompany = (req, res, next) => {
    CompanyModel
        .findOne({ _id: req.params.id })
        .populate({path: 'projects', model: 'Project',populate : {path: 'applications', model: 'Application', populate : {path: 'components', model: 'Component', populate : {path: 'subcomponents', model: 'Subcomponent'}}}})
        .exec()
        .then( company => {
            return res.status(200).json({company});
        })
        .catch(err => res.status(404).json({ message: 'Error when getting company.', error: err }))
}

/**
 * company.controller.deleteCompany()
 */
 exports.deleteCompany = (req, res, next) => {
    CompanyModel
        .findOne({ _id: req.params.id })
        .then( company => {
            if (company !== null) {
                CompanyModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'Application supprimé'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                return res.status(404).json({ message: 'Application non trouvé' })
            }
        })
        .catch(err => res.status(404).json({ message: 'Error when getting companys.', error: err }))
}

/**
 * company.controller.createCompany()
 */
exports.createCompany = (req, res, next) => {
    const items = req.body.company;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));

    // 1 ---------------------
    const company = new CompanyModel({
        title: items.title,
        description: items.description,
        projets: items.projects ?? [],
        created_at: Date.now(),
        update_at: Date.now(),
    });
    company._id = items._id ?? company._id;
    company.createdBy = decoded["userId"];
    company.updatedBy = decoded["userId"];    

    const saveCompanyPromise = company.save().then(company => company).catch(error => error)


    // 2 ---------------------
    const companyRoleAdmin = new RoleModel({
        ressource: company._id,
        role: "COMPANY_ADMIN"
    })

    const saveCompanyRoleAdminPromise = companyRoleAdmin.save().then(role => role).catch(error => error)
    
    // 3 ---------------------
    const companyRoles = ["COMPANY_MODERATEUR", "COMPANY_USER"]
    const roles = [];
    for (i = 0; i < companyRoles.length ; i++) { 
        roles[i] = {
            ressource: company._id,
            role: companyRoles[i]
        }
    }

    const saveOtherSubCompanyRolesPromise = RoleModel.insertMany(roles).then(roles => roles).catch(error => error)
    
    /**
     *  1
     *  2  
     *  3
     */
     Promise.all([saveCompanyPromise, saveCompanyRoleAdminPromise, saveOtherSubCompanyRolesPromise])
     .then(data => {
        const company = data[0]
        const companyAdminRole = data[1]
        const otherSubComponentRole = data[2]

        // on ajoute le role admin aux createur de component
        const addSubComponentAdminRoleToTheCreator = UserModel.updateMany({_id: decoded["userId"]}, {$addToSet :{role_company: companyAdminRole._id }})
            .then(users => users)
            .catch(error => error)

        Promise.all([addSubComponentAdminRoleToTheCreator])
            .then(data2 => res.status(200).json({data2, data}))
            .catch(error => res.status(400).json({error: error}))
    })
    .catch(error => res.status(400).json({error: error}))

};



/**
 * company.controller.modifyCompany()
 */
 exports.modifyCompany = (req, res, next) => {
    const items = req.body.company;
    const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""));
    CompanyModel
        .findOne({ _id: req.params.id })
        .then( company => {
            const newItem = {
                title: items.title,
                description: items.description,
                projets: items.projets ?? [],
                update_at: Date.now(),
            }
            newItem.updatedBy = decoded["userId"];    

            CompanyModel.updateOne({ _id: req.params.id }, newItem)
                .then((application) => res.status(200).json({message : 'Application modifié', application: application}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(err => res.status(404).json({ message: 'Error when getting company.', error: err }))
}