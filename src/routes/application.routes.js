var express = require('express');
var router = express.Router();
var applicationController = require('../controllers/application.controller.js');

/*
 * GET
 */
router.get('/', applicationController.getAllApplication);

/*
 * GET
 */
router.get('/:id', applicationController.getOneApplication);

/*
 * POST
 */
router.post('/', applicationController.createApplication);

/*
 * PUT
 */
router.put('/:id', applicationController.modifyApplication);

/*
 * DELETE
 */
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
