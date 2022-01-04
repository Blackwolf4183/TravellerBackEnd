const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");


const getUsers = async (req, res, next) => {

  let users
  try{
    users = await User.find({},'-password'); //to exclude password
  }catch(error){
    return(next(new HttpError("Something went wrong. Could not get users"),500 ))
  }

  res.json({users: users.map(user => user.toObject({getters:true}))})
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check you data.", 422)
    );
  }

  const { name, email, password} = req.body;

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

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png",
    places: [], //al crear el usuario sus lugares están vacios
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again."), 500);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if(!existingUser || existingUser.password !== password){
    return(next(new HttpError("Invalid credentials. Could not verificate ")))
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
