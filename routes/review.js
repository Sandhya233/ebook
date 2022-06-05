const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const {verifylogin} = require("../middleware/verifylogin");
const Review = require("../models/review");
const { check, validationResult, body } = require("express-validator");
router.post('/review/:id',verifylogin, [
    check("rating").notEmpty().withMessage("Rating cannot be empty")
    .isNumeric().withMessage("Rating must be  number")
  .isLength({ max: 5,min:1})
  .withMessage("Rating must be between 1 and 5"),
], async (req, res) => {
    const user = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var allErrors = {};
    errors.errors.forEach(function (err) {
      allErrors[err.param] = err.msg;
    });
    return res.json({
      status: "fail",
      data: allErrors,
    });
  }
    const review = new Review({
        rating: req.body.rating,
        reviewtext: req.body.reviewtext,
        bookid: req.params.id,
        userid:req.user.id
    })
  try {
  
        await review.save()
        res.status(201).json({ status: "success", data: { review: review } });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            message: " error occured please try again",
        })
    }
})
router.get("/review", async (req, res) => {
    try {
      const review = await Review.find({});
      res.json({ status: "success", data: { review: review } });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Server error",
      });
    }
});
router.get('/review/:id', async (req, res) => {
    try {
      
        const review = await Review.findById(req.params.id);
      res.json({ status: "success", data: { review:review } });
    } catch (error) {
        console.log(error)
      res.status(400).json({
        status: "error",
        message: "Server error",
      });
    }
  });
router.put('/review/:id',verifylogin,[
  check("rating").notEmpty().withMessage("Rating cannot be empty")
  .isNumeric().withMessage("Rating must be  number")
.isLength({ max: 5,min:1})
.withMessage("Rating must be between 1 and 5"),
],async (req, res) => {
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        var allErrors = {};
        errors.errors.forEach(function (err) {
          allErrors[err.param] = err.msg;
        });
        return res.json({
          status: "fail",
          data: allErrors,
        });
      }
    const review = await Review.findByIdAndUpdate(req.params.id, {
     ...req.body
    }, {
      new: true,
    });
  res.json({ status: "success", data: { review: review } });
  } catch (error) {
    console.log("error")
  res.status(400).json({
    status: "error",
    message: "Server error",
  });
}
})
router.delete('/review/:id',verifylogin, async (req, res) => {
  try {
    const review= await Review.findByIdAndDelete(req.params.id);
   
    return res.json({
      status: "success",
      data: { review: review },
      messsage: "deleted successfully ",
    });
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "Server error" });
  }
})
module.exports = router;