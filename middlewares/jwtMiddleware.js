const jwt = require("jsonwebtoken")
const jwtAuthorization= (req,res,next)=>{
    console.log('inside jwt middleware');
    try{
        const token = req.headers['authorization'].split(" ")[1]
        const jwtResponse= jwt.verify(token,'supersecertkey1234')
        console.log(jwtResponse);
        next()
    }catch(err){
        res.status(401).send("unauthorized access")
        console.log(err);
        
    }
    
}

module.exports = jwtAuthorization