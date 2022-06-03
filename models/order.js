const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({

        bookid : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Book",
        },
    quantity: {
        type: String,
        default:1,
     },
    totalcost: Number,
    shippingaddress: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
     },
     
     user_id : {
             type : mongoose.Schema.Types.ObjectId,
             ref : "User",
       
          },
    status: {
        type: String, 
        enum: ['Pending', 'Confirmed'],
        default: 'Pending'
      },
     orderTime : {
         type : Date,
         default : Date.now(),
     }
 });
 
module.exports = mongoose.model("Order", orderSchema);
