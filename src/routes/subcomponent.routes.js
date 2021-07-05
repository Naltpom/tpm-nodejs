var express = require('express');
var router = express.Router();
var subcomponentController = require('../controllers/subcomponent.controller.js');

/*
 * GET
 */
router.get('/', subcomponentController.getAllSubcomponent);

/*
 * GET
 */
router.get('/:id', subcomponentController.getOneSubcomponent);

/*
 * POST
 */
router.post('/', subcomponentController.createSubcomponent);

/*
 * PUT
 */
router.put('/:id', subcomponentController.modifySubcomponent);

/*
 * DELETE
 */
router.delete('/:id', subcomponentController.deleteSubcomponent);

module.exports = router;
