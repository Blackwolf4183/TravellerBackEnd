//Routes for loading main page data
const express = require("express");
const router = express.Router();

const mainController = require('../controllers/main-controller');

router.get('/',mainController.getPlaces);

module.exports = router;