const mongoose = require ("mongoose")

const categoriesSchema  =new mongoose.Schema(
{
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true

    },
    is_list:{
        type:Boolean,
        default:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    }




}
)

const category = mongoose.model("Category",categoriesSchema)
    module.exports = category;


