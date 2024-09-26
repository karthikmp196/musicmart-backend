const products = require("../Models/productSchema");

exports.addProduct=async(req,res)=>{
//    console.log("inside product controller");
   
    try{
        const pimage = req.file.filename
        const{pname,pcategory,price,pdescription}= req.body
        // console.log(pname,pcategory,price,pdescription,pimage);
        

        if(!pimage|| !pname|| !pcategory|| !price|| !pdescription) {
            res.status(404).json("please fill the data")
        }
        else
        {
            const newProduct= new products({
             productimage:pimage ,pname,category:pcategory,price,description:pdescription
            })
        
      

    await newProduct.save()
    res.status(200).json(newProduct)
   

    }
}catch(err){
    res.status(500).json('Error',err)
}   
}


exports.showProduct  = async(req,res)=>{
    try{
    const addedProducts = await products.find()
    res.status(200).json(addedProducts)
    }
    catch(err){
        res.status(500).json('Error',err)
    }
}
 
exports.editProduct=async(req,res)=>{
    console.log("inside edit controller");
    
    try{
        const {id} = req.params
        const {pname,description,productimage,category,price} = req.body
        const uploadImage=req.file?req.file.filename:productimage
        const updatedProduct = await products.findByIdAndUpdate({_id:id},{pname,description,price,category,productimage:uploadImage},{new:true})
        await updatedProduct.save()
        res.status(200).json(updatedProduct)
   
   
    }
    catch(err){
        res.status(500).json("internal server error")
        console.log(err);
        
    
    }
}

exports.deleteProduct = async(req,res)=>{
    
    try{
        const {id}=req.params
        const deleteProduct = await products.findByIdAndDelete({_id:id})
        res.status(200).json(deleteProduct)

    }catch(err){
     res.status(500).json("Error")
    }

}


