const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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
  console.log("GET Request in places");
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creatorId === userId;
  });

  if (!place) {
    throw new HttpError("Cound not find an user with given id", 404);
  }

  res.json({ place });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;