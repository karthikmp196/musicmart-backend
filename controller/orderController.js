const orders = require('../Models/orderSchema')
const Razorpay = require('razorpay')

const PDFDocument = require('pdfkit')

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


     exports.pdf = async(req,res)=>{




        const {paymentId}= req.body;
        const razorpay = new Razorpay({
           key_id : process.env.KEY_ID,
           key_secret :process.env.KEY_SECRET
       })
     
       try{
        const payment =await razorpay.payments.fetch(paymentId);
        const payedItem = await orders.findOne({paymentId})
        const doc = new PDFDocument();
        res.setHeader('Content-Type','application/pdf')
        res.setHeader('content-Disposition','attachment;filename=receipt-${paymentId}.pdf');
        doc.pipe(res); 
        doc.fontSize(20).text('payment Receipt',{align:'center'});
        doc.moveDown();
        doc.fontSize(12).text(`paymentId:${payment.id}`);
        doc.text(`order ID:${payedItem._id}`);
        doc.text(`Amount:₹${payment.amount/100}`);
        doc.text(`Status: ${payment.status}`);
        doc.text(`Method: ${payment.method}`);
        doc.text(`Email: ${payment.email}`);
        doc.text(`Contact: ${payment.contact}`);
        doc.end();
       }catch(error)
       {
           console.log('Error in fetching:',error);
           res.status(500).send('error in fetching payment details');
       }
     
     
     
     }
     


