const HttpError = require('../models/http-error');
const Place = require('../models/place');


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