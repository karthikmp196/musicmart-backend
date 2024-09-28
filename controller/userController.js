const sendOtpMail = require("../helper/otpSend")
const { passwordHashing, comparePassword } = require("../helper/password")
const sendPasswordMail = require("../helper/sendmail")
const users1 = require('../Models/userSchema')
const jwt = require('jsonwebtoken')
const otpGenerator=require('otp-generator')

exports.register=async(req,res)=>{   
try{
    const{fname,lname,email,phone,password,address}=req.body
if(!fname||!lname||!email||!phone||!password||!address)    
    {
    res.status(401).json("please enter the form completely")
    }

else   
 {
const existingUser = await users1.findOne({email})
   if(existingUser)
   {
    res.status(406).json("Already exist")
   }

   else
   { 
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
    const otpExpires =  Date.now()+1*60*1000
    await sendOtpMail(email,otp) 
    const hashedPassword= await passwordHashing(password)



    const newUser= new users1({
        fname,lname,email,phone,password:hashedPassword,address,profileimg:"",otp:otp, otpExpires:otpExpires
    })
    await newUser.save()
    res.status(200).json(newUser)
   }
}
}

catch(err){
    res.status(500).json("Error in register controller")
    console.log(err);
    
}

}

// exports.otpVerify=async(req,res)=>{
//     try{
// const{otp,email}= req.body
// const user = await users1.findOne({email})

// if(!user)
// {
// res.status(404).json("user not exist")
// }

// else{
//    const timeNow =  Date.now()
//    if(timeNow  < user.otpExpires)
//     {
//     const mailOtp = user.otp
    
//     if(mailOtp == otp)
//     {
//         user.isVerified = true
//         user.otp=null
//         user. otpExpires = null
       
//         await user.save()
//         res.status(200).json('otp matching')
//     }
//     else
//     {
//         res.status(405).json('otp not matching')
//     }
//     }
//     else
//    {
//     res.status(407).json('Time Expired')
//    }
//  }} catch(err){
// res.status(500).json("error")
// console.log(err);

//     }
// }

exports.otpVerify=async(req,res)=>{
    try{
      const {otp,email} = req.body
      console.log("inside otpVerify");
      
      console.log(otp,email);
      
      const user = await users1.findOne({email})
      if(!user){
        res.status(406).json('email not valid')
      }else{
        
        const timenow = Date.now()
       if(timenow<user.otpExpires){
        const mailotp = user.otp
         if(mailotp == otp){
            user.isVerified = true
            user.otp=null
            user.otpExpires=null
            await user.save()
            res.status(200).json('verified')
        }else{
            res.status(405).json('not matching')
        }
    }else{
        res.status(407).json('time expired')
    }
      }
      
    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
}

exports.resendOtp=async(req,res)=>{
    try{
        
        const{email} = req.body
        console.log(email);
        console.log("inside resensd");
        
        
        const user = await users1.findOne({email})
        const current = Date.now()
        if(user.otpExpires < current){
             const otp = otpGenerator.generate(6,{digits:true,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})
             const otpExpires = Date.now()+1*60*1000           
            await sendOtpMail(email,otp)
            user.otp = otp
            user.otpExpires = otpExpires
            await user.save()
            res.status(200).json(user)
        }else{
            res.status(406).json('not expired')
        }

    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
}











exports.login = async(req,res)=>{
    try{
        const{email,password} = req.body
        if(!email||!password){
            res.status(401).json("Enter the form")
        }
        else{
            const userExist = await users1.findOne({email})
            if(!userExist)
            {
                res.status(404).json("invalid username")
            }
            else{
             const match = await comparePassword(password,userExist.password)
             if(!match)
             {
                res.status(404).json("Wrong password")
             }
             else{
                const token = jwt.sign({id:userExist._id},"supersecertkey1234")
                res.status(200).json({userExist,token})
             }
            }
        }
    }
    catch(err){
        res.status(500).json("Error in register controller")
        console.log(err);
        
    }
}

exports.googleRegister=async(req,res)=>{
try{
    const{
        aud,family_name,given_name,email,picture} = req.body
    if(!
        aud||!email||!family_name||!given_name){
        res.status(401).json("Login failed")
    }
    else{
        const exUser = await users1.findOne({googleID:
            aud})
        if(!exUser){
            const userNew = new users1({fname:given_name,lname:family_name,email:email,phone:"",role:"",password:"",address:"",profileimg:picture,googleID:aud})
            await userNew.save()
            const token = jwt.sign({id:userNew._id},"supersecertkey1234")
            res.status(200).json({user:userNew,token})
        }else{
            const token = jwt.sign({id:exUser._id},"supersecertkey1234")
            res.status(200).json({user:exUser,token})
        }
       
}
}
catch(err){
    res.status(500).json("error in register controller")
    console.log(err);
    
}
}

//forget password
exports.forgetPasswordController = async(req,res)=>{
    const {email} = req.body

    try{
    const user = await users1.findOne({email})
    if(!user){
        res.status(404).json("User not found")
    }else{
       const resestToken = jwt.sign({id:user._id},"superscretkey12345",{expiresIn:'30m'})
       const baseURL = process.env. BASE_URL
       const resetLink = `${baseURL}/ResetPassword/${resestToken}`

       await sendPasswordMail(email,resetLink,user.fname)
       res.status(200).json("Email sent successfully")
    }
   }catch(err){
    res.status(500).json("Internal Server Error!")
    console.log(err);
    
}
}



//save password

exports.savePassword =async(req,res)=>{

    const {token,password} = req.body
    try{
    const decode = jwt.verify(token,"superscretkey12345")
    console.log(decode);
    
const user = await users1.findById(decode.id)
if(!user)
{
    res.status(404).json("user not found")
}
else
{
    const hashedPassword = await passwordHashing(password)
    user.password=hashedPassword
    user.save()
    res.status(200).json("password updated")
}
}
catch(error){
if(error.name== 'Tokenexpirederror'){
    res.status(406).json("invalid token")
}
res.status(500).json("error in json controller")
console.log(error);

}
}


exports.showUsers  = async(req,res)=>{
    try{
    const regUsers = await users1.find({role:{$ne:1}})
    if(regUsers==0)
    {
    res.status(404).json("user not found")
    }
    else
    {
    res.status(200).json(regUsers)
    }
    }
    catch(err){
        res.status(500).json('Error',err)
        console.log(err);
        
    }
}

exports.editProfile=async(req,res)=>{
    try{
        const {id} = req.params
        const {fname,lname,address,profileimg} = req.body
        const updateImage = req.file?req.file.filename:profileimg
        const updatedProfile = await users1.findByIdAndUpdate({_id:id},{fname,lname,address,profileimg:updateImage},{new:true})
        await updatedProfile.save()
        res.status(200).json(updatedProfile)
   
    }
    catch(err){
res.status(500).json("error")
console.log(err);

    }
}
