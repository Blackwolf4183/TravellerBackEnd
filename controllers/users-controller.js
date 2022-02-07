const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //to exclude password
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not get users"),
      500
    );
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId).select(['-password','-email']);
  } catch (error) {
    return next(
      new HttpError("Something went wrong when trying to reach for the user."),
      500
    );
  }

  if (!user) {
    return next(new HttpError("Could not find an user with provided id."), 500);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  /* console.log("GOT SIGN UP REQUEST") */

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check you data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find user"),
      500
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead"),
      422
    );
  }

  //hashing of password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file ? req.file.path : "none",
    places: [], //al crear el usuario sus lugares están vacios
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again."), 500);
  }

  //TOKEN
  let token;
  try{
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  }catch(err){
    return next(new HttpError("Signing up failed, please try again."), 500);
  }


  //res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  res.status(201).json({ userId: createdUser.id, email: createdUser.email,token: token }); //give the token to the frontend
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find user"),
      500
    );
  }

  if (!existingUser) {
    return next(
      new HttpError("Invalid credentials. Could not verificate ", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again",
      500
    );
    return next(error);
  }

  //TOKEN
  let token;
  try{
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  }catch(err){
    return next(new HttpError("Logging in failed, please try again."), 500);
  }

  res.status(201).json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
