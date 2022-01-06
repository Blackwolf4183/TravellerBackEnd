const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; //get the place id encoded in url

  let place;

  //try catch para los errores de la base de datos
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  //try catch para los errores con ids
  if (!place) {
    return next(new HttpError("Cound not find a place with given id", 404));
  }
  //{place} == {place:place}
  res.json({ place: place.toObject({ getters: true }) }); //takes data that can be converted to json
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creatorId: userId });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find any places", 500)
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Cound not find places from user with given id", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check you data.", 422)
    );
  }

  const { title, description, mapsUrl, country,city, creatorId } = req.body;

  const createdPlace = new Place({
    title,
    description,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cm9tZXxlbnwwfHwwfHw%3D&w=1000&q=80",
    country,
    city,
    mapsUrl,
    creatorId,
  });

  /*   console.log(createdPlace); */

  let user;

  try {
    user = await User.findById(creatorId);
  } catch (error) {
    return next(new HttpError("Something went wrong. Could not create place"), 500);
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id"), 500);
  }

  /* console.log(user);
  console.log(createdPlace) */

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session:sess});
    user.places.push(createdPlace); 
    await user.save({session:sess});
    await sess.commitTransaction();

  } catch (err) {
    /* console.log(err); */
    const error = new HttpError("Failed creating place, please try again", 500);
    return next(error); //so code execution continues
  }

  res.status(201).json({ place: createdPlace }); //succesfully created and sent back the place
};


const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check you data.", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not update place", 500)
    );
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not update place", 500)
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creatorId'); //populate refers to document referenced in another
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not delete place", 500)
    );
  }

  if(!place){
    return(next(new HttpError("Could not find a place with given id"),404));
  }

  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove();
    place.creatorId.places.pull(place); //remove place from array in user 
    await place.creatorId.save({session:sess});
    await sess.commitTransaction();
  }catch(error){
    return(next(new(HttpError("Something failed. Could not delete place"))))
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
