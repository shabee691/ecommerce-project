const otpgenerator= require("otp-generator")

const generateotp = ()=>{
    const otp =otpgenerator.generate(4,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        digits:true,
        specialChars:false
    });
    return otp;
}

module.exports = generateotp()