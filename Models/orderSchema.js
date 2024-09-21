const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId ,
        required:true,
        ref:'users1'
    },
    paymentId:{
        type:String,
        required:true
    },
    order:[],
   amount:{
    type:String,
    required:true
}

})

const orders = mongoose.model("orders",orderSchema)
module.exports=orders