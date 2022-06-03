const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
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
 nationality: {
        type: String,
          trim: true,
      },
  language:{
    type: String,
      trim: true,
      required:true,
    },
  books:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'book',
}],
  image: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Author", authorSchema);