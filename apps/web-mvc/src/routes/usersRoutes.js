const express = require('express');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// HTML (views)
router.get('/users', UsersController.listPage);
router.get('/users/new', UsersController.newPage);
router.get('/users/:id/edit', UsersController.editPage);
router.post('/users', UsersController.createFromForm);
router.post('/users/:id', UsersController.updateFromForm);
router.post('/users/:id/delete', UsersController.deleteFromForm);

// JSON API (CRUD)
router.get('/api/users', UsersController.listApi);
router.post('/api/users', UsersController.createApi);
router.put('/api/users/:id', UsersController.updateApi);
router.delete('/api/users/:id', UsersController.deleteApi);

module.exports = router;
