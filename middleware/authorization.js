const mongoose = require("mongoose");
const {Category} = require("../models/category");
const {User} = require("../models/user");
const {Role} = require("../role");
function getUserAuthorization(req, res, next){
    const user = req.user;

    try{
        if(user.role === Role.admin){
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
/*async function categoryPermissions(req, res, next){
    const user = req.user;
    try{
        await Category.findById(req.params.id)
                    .exec((error, categoryDetail)=>{
                        if(!categoryDetail){
                            return res.status(400).send({status: "fail", data:{category: "The category doesn't exists"}})
                        }
                        if(error){
                            return res.status(400).send({status: "error", message:error.message});
                        }else{
                            if(user.role === Role.admin){
                                next();
                            }else{
                                
                                return(res.status(400).send({status:"fail", data:{user: "User not authorized"}}))
                            }
                        }
                    });
    } catch (ex) {
        console.log(ex)
        return res.status(400).send({status:"error", message:"Something went wrong"});
    }

}
*/
module.exports.getUserAuthorization = getUserAuthorization;
//module.exports.categoryPermissions = categoryPermissions;