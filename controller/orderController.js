const orders = require('../Models/orderSchema')

exports.orderProducts=async(req,res)=>{
    console.log('inside orderproducts');
    
    try{
        const{id}=req.params
        const{paymentId,products,amount}=req.body

const productdetails= new orders({
    userid:id,
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
//  const getorder=async(req,res)=>{
// try{
//     const{id}=req.params
    //const{}
// }
//  }




