const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const { check, validationResult } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const multer = require("multer");
// configure image file storage
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "/.images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
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
router.post(
    "/books",
    upload.single("bookpicture"),
    [
      check("title").notEmpty().withMessage("Book must have a title"),
      check("author")
        .notEmpty()
        .withMessage("Book must have author"),
        check("ISBN").notEmpty().withMessage("Book must have a ISBN "),
    ],
    auth,
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
      const book = new Book({
        ...req.body,
      });
      try {
        await book.save();
        res.status(201).json({ status: "success", data: { posts: notice } });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: "error",
          message: " error occured please try again",
        });
      }
    }
  );