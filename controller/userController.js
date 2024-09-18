const { passwordHashing, comparePassword } = require("../helper/password")
const users1 = require("../Models/userschema")
const jwt = require('jsonwebtoken')


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

    const hashedPassword= await passwordHashing(password)
    const newUser= new users1({
        fname,lname,email,phone,password:hashedPassword,address,profileimg:""
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
    const{id,fname,lname,email,profileimg} = req.body
    if(!id||!email||!fname||!lname){
        res.status(401).json("Login failed")
    }
    else{
        const exUser = await users1.findOne({googleID:id})
        if(!exUser){
            const userNew = new users1({fname,lname,email,phone:"",role:"",password:"",address:"",profileimg:"",id})
            await userNew.save()
            const token = jwt.sign({id:userNew._id},"supersecertkey1234")
            res.status(200).json({userNew,token})
        }else{
            const token = jwt.sign({id:exUser._id},"supersecertkey1234")
            res.status(200).json({userNew,token})
        }
      

        
        
       
}
}
catch(err){
    res.status(500).json("error in register controller")
    console.log(err);
    
}
}





