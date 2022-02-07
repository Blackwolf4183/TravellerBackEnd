const express = require("express");
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const { check } = require("express-validator");
const checkAuth = require('../middleware/check-auth');

const placesController = require("../controllers/places-controller");

router.get("/:pid", placesController.getPlaceById);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("country").not().isEmpty(),
    check("city").not().isEmpty(),
    check("mapsUrl").not().isEmpty(),
  ],
  placesController.createPlace
);

router.patch("/:pid", [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],placesController.updatePlace);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;
