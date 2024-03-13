const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const CartSchema = new mongoose.Schema (
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
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                default:0
            },
            totalPrice:{
                type:Number,
                default:0
            }
    
        }],
        couponDiscount: {
            type: String,
            ref:'Coupon',
          },
    }
)

module.exports = mongoose.model("cart",CartSchema)