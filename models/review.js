const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    rating: Number,
    reviewtext: String,
    bookid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book',
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
})
module.exports =  mongoose.model("Review", reviewSchema);