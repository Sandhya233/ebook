const mongoose = require("mongoose");
const {Category} = require("../models/category");
const {User} = require("../models/user");
const {Role} = require("../role");
function getUserAuthorization(req, res, next){
    const user = req.user;
    console.log(user)
    try {
     
        if (user.role === Role.admin) {
          
            next()
        } else {
            console.log(user)
            console.log(user.role)
            return res.status(401).send({status: "fail", message: "unauthorized access"})
        }
    } catch (ex) {
        console.log(ex)
        return res.status(404).send("Something went wrong");
            }
}
module.exports.getUserAuthorization = getUserAuthorization;