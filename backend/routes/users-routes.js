const express = require('express');

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/:uid', usersController.getUserById);

router.get('/', usersController.getUsers);

router.get('/check_auth/:token', usersController.verifyToken)

router.post('/login', usersController.login);

router.post('/signup', usersController.signup);

router.patch('/:uid', usersController.updateUserImage);

module.exports = router;