const nodemailer = require("nodemailer");




const dotenv = require("dotenv")
dotenv.config()





let sendotp= nodemailer.createTransport({
       port: process.env.SMTP_PORT,
       host:process.env.SMTP_HOST,
       service:process.env.SMTP_SERVICE,
       secure:true,
    auth:{
        user:process.env.SMTP_MAIL ,
        pass:process.env.SMTP_PASSWORD

    },
   
});



module.exports=sendotp;

