const express = require("express");
const router = express.Router();

usersController = require('../controllers/users-controller')

router.get('/',usersController.getUsers);

router.post('/signup',usersController.signup);

router.post('/login',usersController.login)

module.exports = router;