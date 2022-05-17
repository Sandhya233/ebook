const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    info : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "book",
        },
        title : String,
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
         id : {
             type : mongoose.Schema.Types.ObjectId,
             ref : "User",
         },
         username: String,
         phoneno: String,
         
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
 
 module.exports =  mongoose.model("Order", orderSchema);