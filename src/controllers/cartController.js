const Cart = require ("../../models/cart")
const Product = require("../../models/addproduct")
const address = require ("../../models/address")
const User = require("../../models/signup")
const coupon=require("../../models/coupon")
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

const addCart = async (req,res)=>{
try{
        const UserActive = req.session.user_id
        if(!UserActive){
            return res.json({session:false,error:'you need to login'})
        }
        const product_id = req.body.productId

        const ProductData = await Product.findById(product_id)
        if(ProductData.quantity==0){
            return res.json({quantity:false,error:'produt is out of stock!'})
        }
        
        if(ProductData.quantity>0){
            const CartData = await Cart.findOne({user:UserActive ,'product.productId': product_id})
            
        
        if(CartData){
            return res.json({success:false})
        }
        const data = {
            productId: product_id,
            price: ProductData.price,
            totalPrice: ProductData.price,
        }
        await Cart.findOneAndUpdate(
            { user: UserActive },
            {
                $set: { user: UserActive, couponDiscount: 0 },
                $push: { product: data },
            },
            { upsert: true, new: true }
        );

        return res.json({ success: true, stock: true });
    

    }

}catch(err){
    console.log(err);
}
}
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
const loadaccount = async(req,res)=>{
    try {
        const user = req.session.user_id
        const userData = await User.findOne({_id:user})
        const  addresses = await address.findOne({user:user})
        const orders = []
        // const orders = await Order.find({userId:req.session.user_id})
        const CouponData = await coupon.find({})    
        res.render('account',{userData,addresses,orders,CouponData,user})
    } catch (error) {
        console.log(error);
    }
  }

const loadcheckout = async(req,res)=>{ 
    try {
        const userId = req.session.user_id;
        const  addresses = await address.findOne({user:userId})
        const cartData = await Cart.findOne({user:userId}).populate('product.productId').populate('user')
        if(cartData){
            cartData.couponDiscount!=0 ? await cartData.populate('couponDiscount') : 0
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
    loadaccount,

}