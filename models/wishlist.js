const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const WishlistSchema = new mongoose.Schema (
    {
        user:{
            type:ObjectId,
            ref:"signupdata",
            require:true,
        },
        product : [{
            productId:{
                type:ObjectId,
                ref:"product",
                required:true,
            },
            name:{
                type:String
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                default:0
            },
            
    
        }],
        couponDiscount: {
            type: String,
            ref:'Coupon',
          },
    }
)

module.exports = mongoose.model("wishlist",WishlistSchema)