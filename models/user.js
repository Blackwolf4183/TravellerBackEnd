const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //unique for speeding up querying
  password: { type: String, required: true, minlength:5},
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }] //ponemos un array ya que puede haber más de un lugar por usuario
});

userSchema.plugin(uniqueValidator); //we can only create user if email doesnt exist

module.exports = mongoose.model('User',userSchema);