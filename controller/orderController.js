const orders = require('../Models/orderSchema')

exports.orderProducts=async(req,res)=>{
    console.log('inside orderproducts');
    
    try{
        const{uid}=req.params
        const{paymentId,products,amount}=req.body
 
        console.log(paymentId,products,amount);
        
const productdetails= new orders({
    userid:uid,
    paymentId:paymentId,
    order:products,
    amount

})

await productdetails.save()
res.status(200).json(productdetails) 

}
catch(error){
    res.status(500).json('error in json controller')
    console.log(error);
}
}


exports.getorder=async(req,res)=>{
try{
    
    const orderedItems = await orders.find()
    if(orderedItems){
       
        res.status(200).json(orderedItems)
    }else{
        res.status(406).json('no orders')
    }
   
}catch(err){
    res.status(500).json('error')
    console.log(err);
    
}
 }


 exports.getuserorder=async(req,res)=>{
    try{
        const {uid} = req.params
        const orderedItems = await orders.find({userid:uid})
        res.status(200).json(orderedItems)
    }catch(err){
        res.status(500).json('error')
        console.log(err);
        
    }
     }


