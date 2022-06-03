const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { check, validationResult } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { verifylogin } = require("../middleware/verifylogin");
router.post(
    "/order",verifylogin,
   [
     check("shippingaddress").notEmpty().withMessage("Order must have shipping address"),
      check("city")
        .notEmpty()
        .withMessage("Order must have city"),

    ],
    async (req, res) => {
      console.log(req.file);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        var allErrors = {};
        errors.errors.forEach(function (err) {
          allErrors[err.params] = err.msg;
        });
        return res.json({
          staus: "fail",
          data: allErrors,
        });
      }
      const order = new Order(req.body);
      try {
        await order.save();
        res.status(201).json({ status: "success", data: { orders: order} });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: "error",
          message: " error occured please try again",
        });
      }
    }
);
router.get("/orders",
          async(req, res)=>{
            try {
              const orders = await Order.find().populate({   path: 'bookid',   model: 'Book',   select: 'title , author , ISBN ', })
                .populate({   path: 'user_id',   model: 'User',   select: 'username , phoneno', })
              .exec((error, orders)=>{
                if (error) {
                    console.log(error)
                      return res.send({status: "error", message: error});
                  }
                  return res.status(200).send({status: "success", data:{orders: orders}});
              });
            } catch (ex) {
              console.log(ex)
              return res.status(400).send({status: "error", message: "Something went wrong"});
          }
  });
  router.get("/order/my",
  verifylogin, 
  async(req, res)=>{
    try{
        const user = req.user;
        await Order.find({user_id: user._id}, (error, order)=>{
            if(error){
                return res.status(400).send({status: "error", message: "something went wrong while getting your orders!"});
            }
            return res.status(200).send({status: "success", data:{order: order}});
        });
    }catch(ex){
      console.log(ex)
        return res.status(400).send({status: "error", message: "Can't get orders"});
    }
 });
      
      
module.exports = router;