const mongoose=require("mongoose")

  const mongooseschema=new mongoose.Schema(
{
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
                    },

    password:{
        type:String,
        require:true
    },
    conformPassword:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    Is_verified:{
        type:Boolean,
        default:false,
        required:true
    },
    resetToken: String,
    resetTokenExpiry: Date,
    wallet:{
        type:Number,
        default:0
},
    walletHistory:[{
    date:{
        type:Date
    },
    amount:{
        type:Number,
    },
}]

   
     



})
const collecteddata =mongoose.model("signupdata",mongooseschema)
module.exports = collecteddata;

