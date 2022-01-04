const express = require("express");
const bodyParser = require("body-parser");
const moongose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const mainRoutes = require("./routes/main-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); //before reaches places will parse incoming request body into js data structures and call next();

app.use("/api/main", mainRoutes);

app.use("/api/places", placesRoutes); //for filtering

app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    //if we have already sent a response
    const error = new HttpError("Could not find this route", 404);
    throw error;
  }
  res.status(error.code || 500); //500 means something went wrong
  res.json({ message: error.message || "An unexpected error ocurred" });
});

moongose
  .connect('mongodb+srv://ytterbium:C0mpl3m3nt0@cluster0.dcpvz.mongodb.net/places?retryWrites=true&w=majority')
  .then(
    app.listen(5000, function () {
      console.log("Express server listening on port 5000");
    })
  )
  .catch((err) => {
    console.log(err);
  });
