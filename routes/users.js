const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const { check, validationResult, body } = require("express-validator");
const res = require("express/lib/response");
const req = require("express/lib/request");
const { update } = require("../models/user");
//register user
router.post(
    "/user/register",
  [
      check("username").notEmpty().withMessage("Username cannot be empty"),
      check("email")
        .notEmpty()
        .withMessage("email cannot be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (inputEmai) => {
          const User1 = await User.findOne({ email: inputEmai }).exec();
          if (User1) {
            throw new Error("Email already exists");
          }
        }),
      check("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 6 })
      .withMessage("Password  should have at least 6 characters"),
    ],
    async (req, res) => {
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
      const user = new User(req.body);
      try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({
          status: "success",
          data: { id: user._id, email: user.email },
          token,
        });
      } catch (error) {
        console.log(error)
        res.status(400).json({ status: "error", message: "server error" });
      }
    }
);
 
//login user
router.post(
  "/user/login",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email cannot be empty"),
    body("password")
      .notEmpty()
      .withMessage("Password cannot be empty")
      .custom(async (inputPassword, { req: req }) => {
        req.currentUser = await User.findByCredentials(
          req.body.email,
          inputPassword
        );
        req.token = await req.currentUser.generateAuthToken();
      }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var allErrors = {};
      errors.errors.forEach(function (err) {
        allErrors[err.param] = err.msg;
      });
      return res.json({
        status: "Fail",
        data: allErrors,
      });
    }
    res.json({
      status: "success",
      data: {
        id: req.currentUser._id,
        email: req.currentUser.email,
      },
      token: req.token,
    });
  }
);
  module.exports = router;
  