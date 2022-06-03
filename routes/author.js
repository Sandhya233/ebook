const express = require("express");
const router = new express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const {getUserAuthorization} = require("../middleware/authorization");
const {verifylogin} = require("../middleware/verifylogin");
const { check, validationResult } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const author = require("../models/author");
const multer = require("multer");
// configure image file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "authors");
    },
    filename: function (req, file, cb) {
      cb(null, /*Date.now() + "_" + */file.originalname);
    },
  });
  const filefilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const upload = multer({storage: storage,
  limits:{fileSize: 1024*1024*5},
  filefilter: filefilter});

const type = upload.single("image");

router.post(
    "/authors",type,verifylogin,getUserAuthorization,
   [
     check("firstName").notEmpty().withMessage("Author must have first name"),
      check("lastName")
        .notEmpty()
        .withMessage("Author must have last name"),
       check("language").notEmpty().withMessage("Auhtor must have language"),
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
      const author = new Author(req.body);
      try {
        await author.save();
        res.status(201).json({ status: "success", data: { author: author} });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: "error",
          message: " error occured please try again",
        });
      }
    }
);
router.get("/authors", async (req, res) => {
  try {
    const author = await Author.find({});
    res.json({ status: "success", data: { author: author } });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Server error",
    });
  }
});
router.get("/authors/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.json({ status: "success", data: { author: author } });
  } catch (error) {
    console.log(error)
    res.status(400).json({
     
      status: "error",
      message: "Server error",
    });
  }
});
router.put('/authors/:id',type,verifylogin,getUserAuthorization,[
  check("firstName").notEmpty().withMessage("Author must have first name"),
      check("lastName")
        .notEmpty()
        .withMessage("Author must have last name"),
       check("language").notEmpty().withMessage("Auhtor must have language"),
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
    const authors = await Author.findByIdAndUpdate(req.params.id, {
    ...req.body
    }, {
      new: true,
    });
  res.json({ status: "success", data: { author: authors } });
  } catch (error) {
    console.log("error")
  res.status(400).json({
    status: "error",
    message: "Server error",
  });
}
})
router.delete("/author/:id",verifylogin,getUserAuthorization,
             async (req, res)=>{
                try{
                  const authors= await Author.findByIdAndDelete(req.params.id);
   
                  return res.json({
                    status: "success",
                    data: { author: authors },
                    messsage: "deleted successfully ",
                  });
                }
                catch (error) {
                  console.log(error);
                  res.status(400).json({ status: "error", message: "Server error" });
                }
  })
module.exports = router;