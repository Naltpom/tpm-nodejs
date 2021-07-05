var express = require('express');
var router = express.Router();
var companyController = require('../controllers/company.controller.js');

/*
 * GET
 */
router.get('/', companyController.getAllCompany);

/*
 * GET
 */
router.get('/:id', companyController.getOneCompany);

/*
 * POST
 */
router.post('/', companyController.createCompany);

/*
 * PUT
 */
router.put('/:id', companyController.modifyCompany);

/*
 * DELETE
 */
router.delete('/:id', companyController.deleteCompany);

module.exports = router;
