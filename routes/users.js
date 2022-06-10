const express = require("express");
const bcrypt=require('bcryptjs')
const router = new express.Router();
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken')
const crypto=require("crypto")
const User = require("../models/user");
const {verifylogin} = require("../middleware/verifylogin");
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
router.get("/user/resetpassword",  (req, res) => {
  const randomToken = crypto.randomBytes(8).toString('hex');
  console.log(randomToken)
  const userData = User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user)
      if (!user)
      {
        return res.status(400)
        .send({ status: 'fail', message: 'email doesnot exists' });
      }
      user.resetToken = randomToken;
      user.resetTokenExpiry = Date.now() + 3600000;
      return user.save();
    }).then(result => {
    let  transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bloodnetworkapp@gmail.com", 
          pass: "cxbaishzvmbgxqxo", 
        },
      });
      let info =  transporter.sendMail({
        from: '"E-Book" bloodnetworkapp@gmail.com', 
        to: req.body.email, 
        subject: "Reset password",
        html: `<p>reset your password with the link</p> <a href="http://localhost:3000/user/password/${randomToken}">localhost:3000/user/password/${randomToken}</a> `, 
      });
        res.send({
        status: 'success',
        data: {
          email: req.body.email,
          resetToken: randomToken,
          message: `check your gmail`
        }
      });
    })
    .catch(err => {
      res.send({ status: 'fail', message: err.message })
    }) 
}
)
router.post("/user/password/:resettoken", async (req, res) => {
  try {
    const resetToken = req.params.resettoken;
    console.log(resetToken);
    const password = req.body.password;
    const userId = req.body.userId;
    let resetUser;
    await User.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        console.log(resetUser);
        return bcrypt.hashSync(password, 10);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiry = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.send({ status: 'success', result })
      })
  }
  catch (err) {
    res.send({ status: 'fail', msg: err.message });
  }
})
router.post("/user/changepassword",verifylogin, async (req, res) => {
  try {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      console.log(req.user);
      const currentUser = req.user;
      if (bcrypt.compareSync(oldPassword, currentUser.password)) {
          const hashedPassword = bcrypt.hashSync(newPassword, );
          await User.updateOne({
              _id: currentUser.id
          }, {
              password: hashedPassword
          });
          const user = await User.findOne({ id: currentUser._id })
          const accessToken = jwt.sign({
              userId: user._id,
              role: user.role,
          }, process.env.JWT_PRIVATE_KEY);
        
          return res.status(200).send({
              status: 'success',
              message: 'Password updated successfully',
              accessToken: accessToken
          })
      } else {
          return res.send({ status: 'fail', message: 'Password does not match' });
      }
  } catch (err) {
    console.log(err)
      res.send({ status: 'fail', message: err })
  }
})
  
  module.exports = router;
  