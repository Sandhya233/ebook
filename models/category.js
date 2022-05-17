const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
})
module.exports =  mongoose.model("Category", categorySchema);
