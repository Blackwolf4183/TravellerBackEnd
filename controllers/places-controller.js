const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require('uuid');

let DUMMY_PLACES = [
  {
    id: "p1",
    picture:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cm9tZXxlbnwwfHwwfHw%3D&w=1000&q=80",
    adress: "Piazza del Colosseo, 1, 00184 Roma RM, Italia",
    likes: 12,
    title: "Roman coliseum",
    city: "Rome",
    country: "Italy",
    description: "Just a plain old regular colisseum",
    creatorId: "u1",
    mapsUrl: "https://goo.gl/maps/BXABiiaUEDd2cZmg6",
  },
];

const getPlaceById = (req, res, next) => {

  const placeId = req.params.pid; //get the place id encoded in url
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Cound not find a place with given id", 404);
  }
  //{place} == {place:place}
  res.json({ place }); //takes data that can be converted to json
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creatorId === userId;
  });

  if (!places || places.length === 0) {
    throw new HttpError("Cound not find places from user with given id", 404);
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, mapsUrl, creatorId} = req.body;
  const createdPlace = {
    id: uuidv4(), //create unique id for our place
    title,
    description,
    mapsUrl,
    creatorId
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({place:createdPlace}); //succesfully created and sent back the place
};

const updatePlace = (req, res, next) => {

  const placeId = req.params.pid;
  const { title, description} = req.body;
  const updatedPlace = {... DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  })};

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({message: 'Deleted place.',});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;