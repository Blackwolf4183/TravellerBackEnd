const express = require('express');
const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places',placesRoutes) //for filtering 

app.use((error,req,res,next) =>{
    if(res.headerSent){ //if we have already sent a response
        return next(error);
    }
    res.status(error.code || 500); //500 means something went wrong
    res.json({message: error.message || 'An unexpected error ocurred'});
})

app.listen(5000, function () {
    console.log("Express server listening on port 5000");
    });