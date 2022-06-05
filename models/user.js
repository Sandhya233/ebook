const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
const validator = require('validator')
const jwt=require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
        trim: true,
    required:true,
  },
  lastName: {
    type: String,
      trim: true,
      required:true,
  },
  username: {
    type: String,
      trim: true,
      required:true,
  },
  email: {
    type: String,
      trim: true,
      required: true,
      unique:[true,"Email address is already taken."],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid")
      }
    }
    },
   phoneno: {
        type: String,
       trim: true,
       required:true,
      },
    password: {
        type: String,
      required: true,
      minlength:[6,"Password must be minimum 6 characters"]
  },
  tokens:[{
    token:{
        type:String,
        required:true,
        trim:true
        },
  },
    {timestamps:true},
],  
  gender: String,
  address: String,
  image: {
    type: String,
    default: "",
  },
  role:{
    type: String,
    required: true,
    enum: ["admin", "basic"],
    default:"basic"
  },
 

});
userSchema.method.toJSON=function(){
  const user=this;
  const userObject=user.toObject();
  delete userObject.password;
  delete userObject.token;
  return userObject;
};
userSchema.methods.generateAuthToken=async function(){
  const user=this;
  const token=jwt.sign({_id:user._id,role:user.role},process.env.JWT_PRIVATE_KEY)
  user.tokens=user.tokens.concat({token});
  await user.save();
  return token;
};
userSchema.statics.findByCredentials = async (email,password)=>{
  const user=await User.findOne({email});
  if(!user){
      throw new Error("User doesnot exist");
  }
  const isMatch= await bcrypt.compare(password,user.password);
  if(!isMatch){
      throw new Error("Username and password doesnot match");
  }
  return user;
};
userSchema.pre("save",async function(next){
const user = this;
  if(user.isModified("password")){
      user.password=await bcrypt.hash(user.password,8);
  }
  next();
});
const User=mongoose.model("User",userSchema);
module.exports=User;
module.exports = mongoose.model("User", userSchema);
