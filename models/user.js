const mongoose = require("mongoose");

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
  gender: String,
  address: String,
  image: {
    type: String,
    default: "",
  },
  role:{
    type: String,
    required: true,
    enum: ["admin", "basic"],
    default:"basic"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
