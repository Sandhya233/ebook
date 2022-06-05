const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    title: String,
    ISBN: String,
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Author',
    }],
    description: String,
    category:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
    }], 
    price: Number,
    booksImage: {
        type: String,
        default: "",
      }
})

module.exports = mongoose.model("Book", bookSchema);