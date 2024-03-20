const mongoose = require ("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        quantity:{
            type:Number,
            require:true
        },
        categoryId: {
            type:String,
            require:true
        },
        price:{
            type:Number,
            require:true
        },
        offer:{
            type:String,
            require:false
        },
        Description:{
            type:String,
            require:true
        },
        images:{
            type:Array
        },
        isCategoryBlocked: {
            type: Boolean,
            default: false
        },
        is_blocked: {
            type: Boolean,
            default: false,
            required: true
        }

    })

const addproduct = mongoose.model("product",productSchema)

module.exports = addproduct;