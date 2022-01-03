const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Luis Pérez",
    pic: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    likes: 400,
    numPlaces: 2,
    email: "test@test.com",
    password: "1234",
  },
  {
    id: "u2",
    name: "Jose María",
    pic: "http://bavette.es/wp-content/uploads/donuts-perfectos-copia-1.jpg",
    likes: 2,
    numPlaces: 102,
    email: "test2@tes2t.com",
    password: "1234333",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
  res.status(201).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if(hasUser) throw new HttpError("Could not create user email already exists", 422);

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify user credentials", 401); //401 -> auth failed
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
