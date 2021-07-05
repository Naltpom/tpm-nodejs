var express = require('express');
var router = express.Router();
var componentController = require('../controllers/component.controller.js');

/*
 * GET
 */
router.get('/', componentController.getAllComponent);

/*
 * GET
 */
router.get('/:id', componentController.getOneComponent);

/*
 * POST
 */
router.post('/', componentController.createComponent);

/*
 * PUT
 */
router.put('/:id', componentController.modifyComponent);

/*
 * DELETE
 */
router.delete('/:id', componentController.deleteComponent);

module.exports = router;
