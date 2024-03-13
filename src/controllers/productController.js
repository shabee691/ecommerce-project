 const Category = require ("../../models/categories")
const Product =require ("../../models/addproduct")
const Sharp= require("sharp")

const productload = async function (req,res){
    try{
        const Products =await Product.find()
        res.render("product",{products:Products})
    }catch(error){
        console.log(`productload error${error}`);
    }
}

const addproductload = async function (req,res){
    try{       
        const category = await Category.find()
            res.render("addproduct",{category:category})
    }
    catch(error){
        console.log(`addproduct error${error}`);
    }
}

const addproduct = async (req,res)=>{
   
   try{
    const productD = await req.body
    console.log(req.body);
    const img=req.files.map((files) => files.filename)
    //image rezise
    for (let i = 0; i < img.length; i++) {
        await Sharp("public/assets/images/products/original/" + img[i])
          .resize(500, 500)
          .toFile("public/assets/images/products/sharpened/" + img[i]);
      }
        if(productD.quantity > 0 &&productD.price>0){

            const addproducts = new Product({
                name:productD.name,
                quantity:productD.quantity,
                price:productD.price,
                categoryId:productD.category,
                offer:productD.offer,
                Description:productD.description,
                images:img
            })
            const prod=await addproducts.save()
            console.log(prod);
            res.redirect("/admin/product")

    }}
   catch(error){
        console.log(`addproduct${error}`);
   }
}
const editProductLoad = async (req,res)=>{
    try{
        const productid = req.query.id
        const product = await Product.findOne({_id:productid})
        const category = await Category.find()
        res.render("editproduct",{product,category})
    }
    catch(err){
        console.log(err,':editproductload error');
    }
}

const editProductPost = async (req,res)=>{
    try{
            const productid = req.query.id
            const ProductD = req.body 
            const files=req.files
            const img=req.files.map((files) => files.filename  )
            //image rezise
            for (let i = 0; i < img.length; i++) {
                await Sharp("public/assets/images/products/original/" + img[i])
                  .resize(500, 500)
                  .toFile("public/assets/images/products/sharpened/" + img[i]);
              }

            if(ProductD.quantity>0&&ProductD.price>0){
                const update =  {
                    name:ProductD.name,
                    quantity:ProductD.quantity,
                    price:ProductD.price,
                    categoryId:ProductD.category,
                    offer:ProductD.offer,
                    Description:ProductD.description,
                    images:img
                }
                await Product.findOneAndUpdate({_id:productid},update,)
                res.redirect("/admin/product")
                    
            }
               
    }
    catch(err) {
        console.log("error from the editproduct post:",err)
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const productId= req.params.id
         await Product.findByIdAndDelete(productId)
        res.redirect("/admin/product")

    }
    catch (err){

    }
}



module.exports = {
    productload,
    addproductload,
    addproduct,
    editProductLoad,
    editProductPost,
    deleteProduct
}