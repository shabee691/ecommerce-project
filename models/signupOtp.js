const mongoose = require('mongoose');

const userOtpVerificationSchema = mongoose.Schema({ 
    otp:String,
    createAt:{
        type:Date,
        default:Date.now()
    }
})

userOtpVerificationSchema.index({createAt: 1},{expireAfterSeconds:50})

module.exports = mongoose.model('signupOtpVerification',userOtpVerificationSchema);