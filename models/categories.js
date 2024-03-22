const mongoose = require ("mongoose")

const categoriesSchema  =new mongoose.Schema(
{
    name:{
        type:String,
        require:true,
        unique:true
    },
    description:{
        type:String,
        require:true

    }




}
)

const category = mongoose.model("Category",categoriesSchema)
    module.exports = category;


