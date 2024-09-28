const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
fname:{
    type:String,
    required:true
},
lname:{
type: String,
required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
phone:{
    type:String
},
password:{
    type:String
},
address:{
    type:String
},
profileimg:{
    type:String
},
role:{
    type:String,
    default:0
    
},
googleID:{
     type:String
},
otp:{
  type:String
},
otpExpires:{
    type:Date
},
isVerified:{
    type:Boolean,
    default:false
}

})


const users1 = mongoose.model("users1",userSchema)
module.exports = users1