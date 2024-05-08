const Cart = require ("../models/cart")
const Product = require("../models/addproduct")
const address = require ("../models/address")
const cartLoad = async (req,res)=>{
    try{ 
        const user_id = req.session.user_id; 
        const cartData =  await Cart.findOne({user:user_id}).populate("product.productId")
        const subtotal = cartData?.product.reduce((acc,val)=> acc+val.totalPrice,0)
          res.render('cart',{cart:cartData,subtotal})
      } catch (error) {
          console.log(error);
      }
}
const addCart = async (req, res) => {
    try {
        const UserActive = req.session.user_id;
        if (!UserActive) {
            return res.json({ session: false, error: 'You need to login' });
        }
        const productId = req.body.productId;

        const productData = await Product.findById(productId);
        if (!productData) {
            return res.json({ quantity: false, error: 'Product not found' });
        }

        if (productData.quantity === 0) {
            return res.json({ quantity: false, error: 'Product is out of stock' });
        }

        let cartData = await Cart.findOne({ user: UserActive });
        if (!cartData) {
            // If user has no cart, create a new cart
            cartData = new Cart({ user: UserActive, product: [],});
        }
        const existingProductIndex = cartData.product.findIndex(item => String(item.productId) === String(productId));
        if (existingProductIndex !== -1) {
            // Update quantity and total price
            cartData.product[existingProductIndex].quantity += 1;
            cartData.product[existingProductIndex].totalPrice += productData.price;
        } else {
            // Add the product to the cart
            cartData.product.push({
                productId: productId,
                price: productData.price,
                quantity: 1,
                totalPrice: productData.price
            });
           
        } 
        cartData.couponDiscount = 0;
        await cartData.save();
        // Save the updated cart
       

        return res.json({ success: true, stock: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const updateCart = async (req,res)=>{
    try{
        const productId = req.body.productId
        const user_id = req.session.user_id
        const count = req.body.count
        const product = await Product.findOne({_id:productId})
        const cart = await Cart.findOne({user:user_id})
        if(count===-1){
            const currentQuantity = cart.product.find((p)=>p.productId==productId).quantity
            if(currentQuantity <=1){
                return re.json({success:false,message:"quantity cannot be decreased"})
            }
            
        }
        
        if(count===1){
            const currentQuantity = cart.product.find((p)=>p.productId==productId).quantity
            if(currentQuantity+count>product.quantity){
                return res.json({success:false,message:"cannot add more Quantity"})
            }
        }
        await Cart.findOneAndUpdate(
            { user: user_id, 'product.productId': productId },
            {
                $inc: {
                    'product.$.quantity': count,
                    'product.$.totalPrice': count * cart.product.find((p) => p.productId.equals(productId)).price,
                },
            }
        );

        res.json({ success: true });

    }catch(err){
        console.log(err)
    }
}
const removecartitem = async (req, res) => {
    const productId = req.body.productId;
    const userId = req.session.user_id;

    try {
        await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: { product: { productId: productId } }, 
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

 
const loadcheckout = async(req,res)=>{ 
    try {
            const userId = req.session.user_id;
            const  addresses = await address.findOne({user:userId})
            const cartData = await Cart.findOne({user:userId}).populate('product.productId').populate('user')
            console.log(cartData);
            if(cartData){
                console.log(cartData.couponDiscount,"wh")
                cartData.couponDiscount!=0 ? await cartData.populate('couponDiscount'):0;
                const discountpercentage = cartData.couponDiscount !=0 ? cartData.couponDiscount.discountPercentage : 0;
                const maxDiscount = cartData.couponDiscount !=0 ? cartData.couponDiscount.maxDiscountAmount : 0;
                const subtotal = cartData.product.reduce((acc,val)=> acc+val.totalPrice,0);
                const percentageDiscount = subtotal - (discountpercentage/100) *subtotal;
                const discountAmount =subtotal - percentageDiscount;
                const discount = subtotal - maxDiscount
                console.log(discount,subtotal,"discount","subtotal")
                if(discountAmount<=maxDiscount){
                    res.render('checkout',{addresses,discount:percentageDiscount,cartData,subtotal,disamo:discountAmount})
                }else{
                    res.render('checkout',{addresses,discount,cartData,subtotal,disamo:maxDiscount})
                }
                console.log(discountpercentage,percentageDiscount,"percentage");
            }
        } catch (error) { 
            console.log(error);
        }
}
module.exports={
    cartLoad,
    addCart,
    updateCart,
    loadcheckout,
    removecartitem,
}