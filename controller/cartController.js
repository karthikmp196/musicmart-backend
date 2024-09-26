const carts = require("../Models/cartSchema");


exports.addToCart = async(req,res)=>{
    console.log("inside add to cart");
    
    try{

    
const {uid} = req.params
const {pid,pcount} = req.body


const existingUser = await carts.findOne({uid})
console.log(existingUser);

if(existingUser){
    const item = existingUser.items.find(p=>p.pid == pid)
    console.log(item);
    if(item){
        item.pcount += pcount
    }
    else{
        existingUser.items.push({pid,pcount})
    }
    await existingUser.save()
    res.status(200).json(existingUser)
    
}
 else{
     const newCart = await carts.create({
          uid,
          items:[{pid,pcount}]
      })
      await newCart.save()
      res.status(200).json(newCart)
 }

    }

    catch(err){
        res.status(500).json('error')
console.log(err);

    }

}


exports.getFromCart=async(req,res)=>{
console.log("inside getfromcart");

try{
    const {uid} = req.params
    const cartItems= await carts.findOne({uid}).populate('items.pid','pname productimage description price')
    if(cartItems){
        res.status(200).json(cartItems)
    }
    else{
        res.status(400).json('empty')
    }


}
catch(err)
{
    res.status(500).json('error')
    console.log(err);
    
}

}

exports.removeFromCart=async(req,res)=>{

    console.log("Inside remove from cart");
    
    try{
        const {uid} = req.params
        const {pid} = req.body
        console.log(pid ,uid);
        
        const cart = await carts.findOne({uid})
        if(cart){
            cart.items = cart.items.filter(p=>p.pid!=pid)
            await cart.save()
            res.status(200).json("Cart item removed")
        }else{
            res.status(404).json("Cart not found")
        }
    }
    catch(err)
{
    res.status(500).json('error')
    console.log(err);
    
}


}

exports.deleteProduct=async(req,res)=>{
    console.log("Inside delete cart");
try{
    const {id} = req.params    
    const deleteProducts = await carts.findOneAndDelete({uid:id})
    res.status(200).json(deleteProducts)
}
catch(err){
res.status(500).json("Error")
console.log(err);
}
}

