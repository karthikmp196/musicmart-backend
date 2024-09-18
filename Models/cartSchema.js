const mongoose = require('mongoose') 

const cartSchema = new mongoose.Schema({

    uid:{
        type:mongoose.Schema.Types.ObjectId ,
        required:true,
        ref:"users"
    },
    items:[
            {
            pid:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"products"
            },
            pcount:{
                 type:Number,
                 required:true

            }
        }
        ]

})

const carts = mongoose.model("carts",cartSchema)
module.exports = carts