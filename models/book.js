const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    title: String,
    ISBN: String,
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'author',
    }],
    description: String,
    category:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'category',
    }], 
    price: Number,
    /*reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'reviews',
    }],*/
    booksImage: {
        type: String,
        default: "",
      }
})

module.exports = mongoose.model("Book", bookSchema);