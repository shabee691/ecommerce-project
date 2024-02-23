


const Userss = require("../../models/signup")
const bcrypt = require("bcrypt")
const sendotp = require("../../services/otp")
const otp = require("../../services/genratorOtp")
const signupOtpVerification = require("../../models/signupOtp")



const dotenv = require("dotenv");
dotenv.config()














const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}






const signupget = (req, res) => {
  res.render("signup")
};

const signupPost = async (req, res) => {
  emaila = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const existingUser = await Userss.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],

  });
  try {



    //  if (!req.body.name && !req.body.email && !req.body.mobile && !req.body.password &&! req.body.name) {
    //      return res.render("signup",  { message: 'All fields are required.' });

    // }


    //   if (!emailRegex.test(req.body.email )) {
    //     return res.render("signup", { message:'Invalid email format.' });


    // }

    //   if (req.body.password.length < 8) {
    //     return res.render("signup",{ message: 'Password must be at least 8 characters long.' });


    // }
    //  if (req.body.mobile.length < 10){
    //       res.render("signup",{message: "Mobile number should be 10 digit "})
    //     return;
    // }
    //  if (existingUser) {
    //     res.render("signup", { message: "User already exists" });
    //     return; 

    //   }
    //   if(req.body.password!==req.body.conformPassword){
    //     res.render("signup",{message:"Conform Password Should be same as first password"})
    //     return;
    //   }




    const spassword = await securePassword(req.body.password)

    const { name, email, mobile } = req.body;

    const user = new Userss({
      name: name,
      email: email,
      mobile: mobile,
      password: spassword,
    })


    const userData = await user.save();

    console.log(userData);

    await signupotp(userData, res)









  }


  catch (error) {
    console.error("this is the error", error.message);
  }

};



const signupotp = async ({ email }, res) => {

  try {

    const sendmail = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Email verification",
      html: `<h2>Thank you for choosing our website</h2>
     for verification of ${email}
      <p>and your otp is : ${otp}</p>
    `

    };
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOtpVerification = new signupOtpVerification({
      otp: hashedOtp,
      createAt: Date.now(),
    });

    const verifydata = await newOtpVerification.save();

    console.log(verifydata);

    await sendotp.sendMail(sendmail)

    res.redirect(`/verifyotp`);
  } catch (error) {

    console.log("the eerror", error);


  }
}





const loginget = (req, res) => {
  res.render("login")
};
const loginpost = async (req, res) => {


  try {

    if (!email && !password) {

    }
  }
  catch (e) {

  }
};




const otpverificationget = async (req, res,) => {

  res.render("otp", { emaila })




};
const otpverificationpost = async (req, res) => {

  try {
    const postotp = req.body.otp
    console.log(postotp);

    const hashed = await signupOtpVerification.findOne();
    const { otp: hashedOtp } = hashed
    console.log(hashedOtp);


    const validOtp = await bcrypt.compare(postotp, hashedOtp);

    if (!validOtp) {
      return res.render("otp", { message: "otp was expired/not valid" })
    }
    else {
      await Userss.updateOne({ $set: { Is_verified: true } });
      res.redirect("/login")


    }

  }
  catch (error) {
    console.log(error);
  }
};





module.exports = {
  signupget,
  signupPost,
  loginget,
  loginpost,
  otpverificationget,
  otpverificationpost

}