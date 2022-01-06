const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

usersController = require("../controllers/users-controller");

router.get("/", usersController.getUsers);

router.get("/:uid",usersController.getUserById);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
