const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const Review = require("../models/review");
const {getUserAuthorization} = require("../middleware/authorization");
const {verifylogin} = require("../middleware/verifylogin");
const { check, validationResult } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const multer = require("multer");
// configure image file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
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

const type = upload.single("booksImage");
router.post(
    "/books",type,verifylogin,getUserAuthorization,
   [
     check("title").notEmpty().withMessage("Book must have a title"),
      check("author")
        .notEmpty()
        .withMessage("Book must have author"),
       check("ISBN").notEmpty().withMessage("Book must have a ISBN "),
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
      const book = new Book(req.body);
      try {
        await book.save();
        console.log(book.review);
        res.status(201).json({ status: "success", data: { book: book} });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: "error",
          message: " error occured please try again",
        });
      }
    }
);
//get all books
router.get("/books",
          async(req, res)=>{
            try {
              const books = await Book.find()
              res.json({ status: "success", data: { book: books } });
                }
            catch(ex){
                return res.status(400).send({status: "error", message: "Something went wrong"});
            }
  });
  router.get("/books/:id",
  async(req, res)=>{
    try {
      const books = await Book.findById(req.params.id)
      console.log(books.review)
      res.json({ status: "success", data: { book: books } });
        }
    catch(ex){
        return res.status(400).send({status: "error", message: "Something went wrong"});
    }
    });
//deleting books
router.delete("/books/:id",verifylogin,getUserAuthorization,
             async (req, res)=>{
                try{
                  const book= await Book.findByIdAndDelete(req.params.id);
   
                  return res.json({
                    status: "success",
                    data: { book: book },
                    messsage: "deleted successfully ",
                  });
                }
                catch (error) {
                  console.log(error);
                  res.status(400).json({ status: "error", message: "Server error" });
                }
  })
//updating books
router.put('/books/:id',type,verifylogin,getUserAuthorization,[
  check("title").notEmpty().withMessage("Book must have a title"),
      check("author")
        .notEmpty()
        .withMessage("Book must have author"),
       check("ISBN").notEmpty().withMessage("Book must have a ISBN "),
],async (req, res) => {
  try {
    const id = req.params.id;
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
    const book = await Book.findByIdAndUpdate(id, 
      {
        title: req.body.title,
        ISBN: req.body.ISBN,
        author: req.body.author,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        booksImage:req.file.path
     }
    , {
      new: true,
    });
  res.json({ status: "success", data: { book: book } });
  } catch (error) {
    console.log("error")
  res.status(400).json({
    status: "error",
    message: "Server error",
  });
}
})
module.exports = router;