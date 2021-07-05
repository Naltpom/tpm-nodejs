var express = require('express');
var router = express.Router();
var projectController = require('../controllers/project.controller.js');

/*
 * GET
 */
router.get('/', projectController.getAllProject);

/*
 * GET
 */
router.get('/:id', projectController.getOneProject);

/*
 * POST
 */
router.post('/', projectController.createProject);

/*
 * PUT
 */
router.put('/:id', projectController.modifyProject);

/*
 * DELETE
 */
router.delete('/:id', projectController.deleteProject);

module.exports = router;
