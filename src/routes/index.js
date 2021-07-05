const express = require("express");
const routes = express.Router();
var multer = require('multer');
var upload = multer();

const login = require('../middleware/login');
const register = require('../middleware/register');

const userRoute = require('../routes/user.routes')

const companyRoute = require('../routes/company.routes')
const projectRoute = require('../routes/project.routes')
const applicationRoute = require('../routes/application.routes')
const componentRoute = require('../routes/component.routes')
const subcomponentRoute = require('../routes/subcomponent.routes')
const roleRoute = require('../routes/role.routes')

routes.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// for parsing application/json
routes.use(express.json()); 
// for parsing application/x-www-form-urlencoded
routes.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
routes.use(upload.array()); 
routes.use(express.static('public'));


routes.post('/login', login);
routes.use('/register', register);
routes.use('/users', userRoute);


routes.use('/companies', companyRoute);
routes.use('/projects', projectRoute);
routes.use('/applications', applicationRoute);
routes.use('/components', componentRoute);
routes.use('/subcomponents', subcomponentRoute);
routes.use('/roles', roleRoute);




routes.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
})

routes.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.end(error.message);
})

module.exports = routes