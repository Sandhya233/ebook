const express = require("express");
const router = new express.Router();
const User = require("../models/user");
//const { categoryPermissions } = require("../middleware/authorization");
const {getUserAuthorization} = require("../middleware/authorization");
const { verifylogin } = require("../middleware/verifylogin");
const paginatedResults = require("../middleware/paginatedResults");
const Category = require("../models/category");
const { check, validationResult, body } = require("express-validator");
router.post('/category',verifylogin, getUserAuthorization, [
  check("title").notEmpty().withMessage("Title cannot be empty")
  .isLength({ max: 10})
  .withMessage("Title should have maximum 10 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description cannot be empty"),
], async (req, res) => {
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
    const category = new Category({
        title: req.body.title,
        description:req.body.description
    })
  try {
  
        await category.save()
        res.status(201).json({ status: "success", data: { category: category } });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            message: " error occured please try again",
        })
    }
})
router.get("/categories",paginatedResults(Category) ,async (req, res) => {
    try {
      const category = await Category.find({});
      res.json({ status: "success", data: { category: res.paginatedResults } });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Server error",
      });
    }
});
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
      res.json({ status: "success", data: { category: category } });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Server error",
      });
    }
  });
router.put('/category/:id',verifylogin, getUserAuthorization,[
  check("title").notEmpty().withMessage("Title cannot be empty")
  .isLength({ max: 10})
  .withMessage("Title should have maximum 10 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description cannot be empty"),
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
    const category = await Category.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description:req.body.description,
    }, {
      new: true,
    });
  res.json({ status: "success", data: { category: category } });
  } catch (error) {
    console.log("error")
  res.status(400).json({
    status: "error",
    message: "Server error",
  });
}
})
router.delete('/category/:id',verifylogin, getUserAuthorization,async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
   
    return res.json({
      status: "success",
      data: { category: category },
      messsage: "deleted successfully ",
    });
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "Server error" });
  }
})
module.exports = router;