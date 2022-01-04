const HttpError = require('../models/http-error');
const Place = require('../models/place');

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

//TODO: make function that retrieves only latest places
const getPlaces = async (req,res,next) => {

    let places;

    try{
      places = await Place.find(); // TODO: will it crash if getting too many?
    }catch(error){
      return next(new HttpError("Something went wrong. Could not load any places"));
    }

    res.json({places: places.map(place => place.toObject({getters:true}))});
}

exports.getPlaces = getPlaces;