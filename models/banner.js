const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            require:true
        },
        description:{
            type:String,
            require:true
        },
        image:{
            type:String,
            require:true


        },
        targeturl:{
            type:String,
            
        }

    }
)
module.exports = mongoose.model("banner",bannerSchema)