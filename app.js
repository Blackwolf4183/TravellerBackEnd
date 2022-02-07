const fs = require('fs');
const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");
const moongose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const mainRoutes = require("./routes/main-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); //before reaches places will parse incoming request body into js data structures and call next();

app.use('/uploads/images',express.static(path.join('uploads','images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/main", mainRoutes);

app.use("/api/places", placesRoutes); //for filtering

app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, (err) => { //file deletion if there's any errors
      console.log(err);
    }); 
  }
  if (res.headerSent) {
    //if we have already sent a response
    const error = new HttpError("Could not find this route", 404);
    throw error;
  }
  res.status(error.code || 500); //500 means something went wrong
  res.json({ message: error.message || "An unexpected error ocurred" });
});

moongose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcpvz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(
    app.listen(5000, function () {
      console.log("Express server listening on port 5000");
    })
  )
  .catch((err) => {
    console.log(err);
  });
