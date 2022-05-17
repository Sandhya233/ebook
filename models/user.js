const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
        trim: true,
    required:true,
  },
  lastName: {
    type: String,
      trim: true,
      required:true,
  },
  username: {
    type: String,
      trim: true,
      required:true,
  },
  email: {
    type: String,
      trim: true,
      required:true,
    },
   phoneno: {
        type: String,
       trim: true,
       required:true,
      },
    password: {
        type: String,
       required:true,
      },
      
    createdAt: { type: Date, default: Date.now() },
    updatedAt:{ type:Date},
  gender: String,
  address: String,
  image: {
    type: String,
    default: "",
  },
  isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
