const mongoose = require('mongoose')

const productSchema =  new mongoose.Schema({
    
    
    
    productimage:{
        type:String,
        required:true
    },
    

    pname:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    
    description:{
        type:String,
        required:true
    },
   
})

const products = mongoose.model("products",productSchema)
module.exports = products