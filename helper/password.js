const bcrypt = require('bcrypt')
exports.passwordHashing = async(password)=>{
    try{
        const saltrounds=10
        const hashPassword = await bcrypt.hash(password,saltrounds)
        return hashPassword
    }catch(err){
        console.log(err);
        
    }
}


exports.comparePassword = async(hashPassword,hashedPassword)=>{
    const match = await  bcrypt.compare(hashPassword,hashedPassword)
    return match
}