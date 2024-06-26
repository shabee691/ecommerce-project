const Product = require("../models/addproduct")
const wishlist = require("../models/wishlist")
const Cart = require("../models/cart")
const wishlistLoad = async(req,res)=>{
try{ 
        const user_id = req.session.user_id; 
        const wishlistData =  await wishlist.findOne({user:user_id}).populate("product.productId")
          res.render('wishlist',{wishlist:wishlistData,})
}catch (error) {
          console.log(error);
}
}

const addWishlist = async (req,res)=>{
    try{
        const UserActive = req.session.user_id
        if(!UserActive){
            return res.json({session:false,error:'you need to login'})
        }
        const product_id = req.body.productId

        const ProductData = await Product.findById(product_id)
        if(ProductData.quantity==0){
            return res.json({quantity:false,error:'prodcut is out of stock!'})
        }
        
        if(ProductData.quantity>0){
            const CartData = await wishlist.findOne({user:UserActive ,'product.productId': product_id})
            
            if (CartData) {
                // Product already exists in wishlist, so delete it
                await wishlist.findOneAndUpdate(
                    { user: UserActive },
                    { $pull: { product: { productId: product_id } } }
                );
                return res.json({success:false})
            } else { 
        
        const data = {
            productId: product_id,
            name:ProductData.name,
            price: ProductData.price,
            
        }
        await wishlist.findOneAndUpdate(
            { user: UserActive },
            {
                $set: { user: UserActive, couponDiscount: 0 },
                $push: { product: data },
            },
            { upsert: true, new: true }
        );

        return res.json({ success: true, stock: true });
    
        }
    }

}catch(err){
    console.log(err);
}
}

const removeWishlist = async(req,res)=>{
    // console.log('wishlistremove');
    try {
        const { productId } = req.body;
        console.log(productId,'rewish');
        // const user_id = req.session.user_id;
        const userId = req.session.user_id;
        console.log( userId,'wishuseraano');

       const updatedWishlist = await wishlist.findOneAndUpdate(
            { user: userId },
            {
                $pull: { product: { productId: productId } }, 
            }
        );
        console.log(updatedWishlist,'wishundo');
        if(!updatedWishlist){
            return res.status(404).json({ success: false, message: 'Wishlist not found' });  
        }
        return res.json({ success: true, message: 'Wishlist item removed successfully', updatedWishlist });

    } catch (error) {
        console.error('Error removing item from Wishlist:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    
    }
  }

module.exports={
wishlistLoad,
addWishlist,
removeWishlist
}