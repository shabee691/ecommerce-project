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
    },
    is_blocked: {
    type: Boolean,
    default: false
  },
    is_admin: {
    type: Boolean,
    default: false
    },
    resetToken:{
        type: String,
    } ,
    resetTokenExpiry:{
        type:Date,
    } 
})
const collecteddata =mongoose.model("signupdata",mongooseschema)
module.exports = collecteddata;

