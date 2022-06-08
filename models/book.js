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


bookSchema.statics.buildFilterQuery = function (req){
const query = req.query;

let filterQuery = {
  
book: req.book._id
};
let sort = {};

if(query.name){
  filterQuery.name = {
    $regex: query.name
  }
}


if(query.minPrice || query.maxPrice){
  filterQuery.price = {}
}

if(query.minPrice){
  filterQuery.price["$gte"] = query.minPrice
}

if(query.maxPrice){
  filterQuery.price["$lte"] = query.maxPrice
}

if(query.category){
  filterQuery.category = {
    $in: query.category
  }
}

if(query.sortBy){
  const sortData = query.sortBy.split(".");
  sort[sortData[0]] = sortData[1] === "asc" ? 1 : -1;  
}
console.log(filterQuery, sort);
return {
  filterQuery,
  sort
}
}
module.exports = mongoose.model("Book", bookSchema);