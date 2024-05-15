const Banner = require("../models/banner")
const Order = require ("../models/order")
const Userss = require("../models/signup")
const Product = require("../models/addproduct")
const Cart = require ("../models/cart")
const Category = require ("../models/categories")
const address = require("../models/address")
const coupon = require ("../models/coupon")
const bcrypt = require("bcrypt")
const sendotp = require("../services/otp")
const otp = require("../services/genratorOtp")
const signupOtpVerification = require("../models/signupOtp")
const Review = require("../models/review")
const Wishlist = require("../models/wishlist")
const dotenv = require("dotenv");
const crypto = require ("crypto")
const Razorpay = require("razorpay")
const wishlist = require("../models/wishlist")
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
     if (!req.body.name && !req.body.email && !req.body.mobile && !req.body.password &&! req.body.name) {
         return res.render("signup",  { message: 'All fields are required.' });
    }
      if (!emailRegex.test(req.body.email )) {
        return res.render("signup", { message:'Invalid email format.' });
    }
      if (req.body.password.length < 8) {
        return res.render("signup",{ message: 'Password must be at least 8 characters long.' });
    }
     if (req.body.mobile.length < 10){
          res.render("signup",{message: "Mobile number should be 10 digit "})
        return;
    }
     if (existingUser) {
        res.render("signup", { message: "User already exists" });
        return; 

      }
      if(req.body.password!==req.body.conformPassword){
        res.render("signup",{message:"Conform Password Should be same as first password"})
        return;
      }
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
    otpverificationget({userData})
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
      email:email,
      createAt: Date.now(),
    });   
    const verifydata = await newOtpVerification.save();
    console.log(verifydata);
    await sendotp.sendMail(sendmail)
    res.redirect('/verifyotp');
  
  } catch (error) {
    console.log("the eerror", error);
  }}
const loginget = (req, res) => {
  res.render("login")
};
const loginpost = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password 
    const userData = await Userss.findOne({email})
          
        if (userData) {
          if (userData.Is_verified === true) {
              if (userData.is_blocked==true) {
                  res.render('login', { message: "Your account is blocked by the admin." });
                }else{
                  const passwordMatch = await bcrypt.compare(password,userData.password)
              
                if(passwordMatch){
                  req.session.user_id= userData._id
                  res.redirect("/")
                }
                else{
                  res.render('login', { message: "Incorrect password" });
                }
          }
        }else{
          signupotp(userData,res)
           }
        } else {
        res.render('login', { message: "Email is not registered. Please register first." });
    }
      }
  catch (err) {
    console.log("loginpost",err)
}
}; 
const otpverificationget = async (req,res,) => {
 try{ 
  const otp= await signupOtpVerification.findOne()
  if(otp){
    res.render("otp",{otp})
  }
  }catch(err){
    console.log(err)
    res.status(500).json({ message: err.message });
  } 
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
      await Userss.findOneAndUpdate(
        {email:hashed.email},{ $set: { Is_verified: true } }); 
    }
    res.redirect("/login")
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const homeLoad = async(req,res)=>{
  try {
    const user_id = req.session.user_id; 
    const cartData =await Cart.findOne({user:user_id}).populate("product.productId")
    const wishlist = await Wishlist.findOne({user:user_id}).populate("product.productId")
    const userData = await Userss.findOne({_id:user_id})
    const banner = await Banner.find({})
    const product = await Product.find().limit(20)
    res.render('home',{user:userData,cart:cartData,banner,wishlist,product});
} catch (error) {
    console.log(error.message);
}
}
const shopLaod = async (req, res) => {
  try {
      const user_id = req.session.user_id;
      console.log(user_id, 'in shop');

      const searchQuery = req.query.search;
      let productQuery = Product.find();

      // If a search query is provided, filter products by name
      if (searchQuery) {
          productQuery = productQuery.where('name').regex(new RegExp(searchQuery, 'i'));
      }

      // Apply category filter if selected
      if (req.query.category) {
          productQuery = productQuery.where('categoryId').equals(req.query.category);
      }

      if (req.query.priceFilter) {
          if (req.query.priceFilter === 'high-to-low') {
              productQuery = productQuery.sort({ price: -1 });
          } else if (req.query.priceFilter === 'low-to-high') {
              productQuery = productQuery.sort({ price: 1 });
          }
      }

      // Count total documents for pagination
      const totalProducts = await Product.countDocuments(productQuery);

      // Pagination
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const perPage = 6; // Adjust the number of products per page as needed
      const totalPages = Math.ceil(totalProducts / perPage);
      const currentPage = Math.min(page, totalPages);
      const skipValue = Math.max((currentPage - 1) * perPage, 0);

      // Apply pagination and execute the query
      const product = await productQuery
          .skip(skipValue)
          .limit(perPage)
          .exec();

      const cart = await Cart.findOne({ user: user_id }).populate("product.productId");
      const category = await Category.find();
      const wishlistData = await Wishlist.findOne({ user: user_id }).populate("product.productId");

      res.render('shop', {
          product,
          totalPages,
          currentPage,
          category,
          cart,
          searchQuery,
          wishlistData,
          priceFilter: req.query.priceFilter,
          selectedCategory: req.query.category
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
}

    

const productLoad = async (req,res)=>{
  try{
    
    const user = await Userss.find({_id:req.session.user_id})
    const id = req.query.id
    const product = await Product.findOne({_id:id})
    const review = await Review.find({productId:id}).populate('userId');
    const date = Date.now()
    
   res.render("product",{product,user,review,date}) 
  }
  catch(err){
    console.log(err);
  }
}
const loadaccount = async(req,res)=>{
  try {
      const user = req.session.user_id
      
      if(!user){
       const addresses =[]
        const UserData = []
        const orders = []
        const CouponData = []
        const user = []

       res.render("account",{userData:UserData,addresses,orders,CouponData,user})
       
    }
    else{
      const CouponData = await coupon.find({}) 
      const userData = await Userss.findOne({_id:user})
      const  addresses = await address.findOne({user:user})
      const orders = await Order.find({userId:req.session.user_id}).sort({purchaseDate:-1})
      res.render("account",{userData,addresses,orders,CouponData,user});
    }
  } catch (error) {
      res.status(500).send('session expired');
      console.log(error)
  }
}
const userLogout = async (req, res) => {
  try {
      req.session.destroy();
      res.redirect('/login');
  } catch (error) {
      console.log(error.message);
  }
}
const edituser = async (req,res)=>{
  try{
    const userData = await Userss.findById(req.session.user_id)
      await Userss.findOneAndUpdate(
        {email:userData.email},
        {$set:{
          name:req.body.editname,
          mobile:req.body.editmobile,
          email:req.body.editemail,
        }},
        {new:true}
      )
      res.redirect("/account")
  }catch(err){
    console.log(err)
  }
}
const userpasswordChange = async (req,res)=>{
  try{
    const userData = await Userss.findById(req.session.user_id)
    if(req.body.currentpassword||(req.body.newpassword&&req.body.newpassword2)){
      if(!req.body.newpassword||req.body.newpassword===""||!req.body.newpassword2||req.body.newpassword2 ===""){
        return res.render("account",{message:"new passwords cannot be empty"})
      }
      if(req.body.newpassword!==req.body.newpassword2){
        return res.render("account",{maessage:"newpasswords not match"})
      }
      if(req.body.newpassword.length <8 ){
        return res.render("account",{message:"new password atleast 8 character"})
      }
      else{
        const matchPassword = await bcrypt.compare(req.body.currentpassword,userData.password)
        if (matchPassword) {
          sPassword = await securePassword(req.body.newpassword);
      } else {
          return res.render('account', { message: 'Current password is incorrect. Please try again.'});
      }
      }
    } else {
      sPassword = userData.password;
      return res.render('account', { message: 'Please enter either a current password or new passwords.'});
  }
  await Userss.findOneAndUpdate(
    {email:userData.email},
    {
      $set:{
        password:sPassword
      }
    },
    {new:true}
  )
  res.redirect("/account")
  }
  catch(err){
    console.log(err);
  }
}
const forgotpassword = async (req,res)=>{
try{
  const token = req.params.token
  res.render("forgot",{token})
}catch (err){
  console.log(err);
}
}
const forgotpasswordPost = async (req,res)=>{
  try{
    const email = req.body.email
    const User = await Userss.findOne({email})
    if (User){
      const token = crypto.randomBytes(20).toString('hex');
      User.resetToken = token;
      User.resetTokenExpiry = Date.now() + 300000; 
      await User.save()
      const resetLink = `http://localhost:4000/resetPassword${token}`;
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: 'Password Reset',
        html: `
            <p>Dear User,</p>
            <p>We received a request to reset your password. Click the following link to proceed:</p>
            <a href="${resetLink}" style="text-decoration: none; color: #007BFF; font-weight: bold;">Reset Your Password</a>
            <p>If you didn't initiate this request, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Ezycart</p>
        `,
    };
    await sendotp.sendMail(mailOptions);
      res.render("login",{token})
    }else{
      res.render("forgot",{message:"user is not registered"});
    }
  }catch(err){
    console.log(err)
  }
}
const loadresetpassword = async(req,res)=>{
  try {
      const token = req.params.token;

      res.render("resetPassword",{token},)
  } catch (error) {
      console.log(error);
  }
}
const resetPassword = async (req, res) => {
  try {
      const token = req.body.token;
      const pass1 = req.body.password1;
      const pass2 = req.body.password2;
      const user = await Userss.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
      if (pass1 !== pass2) {
          res.render('resetPassword', { message: "Passwords do not match!", token });
      } else {
          const newPasswordHash = await bcrypt.hash(pass1, 10);

          if ( await bcrypt.compare(pass1, user.password) ) {
              res.render('resetPassword', { message: "Your old password and new password are the same!", token });
          } else {
              user.password = newPasswordHash;
              user.resetToken = null;
              user.resetTokenExpiry = null;
              await user.save();
              res.render('login');
          }
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};

const productSearch = async(req,res)=>{
  try {
      const productname = req.query.input.toLowerCase();
      console.log(productname);
      const matchingProducts = await Product.find({
          name: { $regex: productname, $options: 'i' } 
      });
      console.log(matchingProducts.length)
      res.json({ suggestions: matchingProducts });

  } catch (error) {
      console.log(error);
  }
}



module.exports = {
  signupget,
  signupPost,
  loginget,
  loginpost,
  otpverificationget,
  otpverificationpost,
  homeLoad,
  shopLaod,
  productLoad,
  edituser,
  userpasswordChange,
  loadaccount,
  productSearch,
  userLogout,
  forgotpassword,
  forgotpasswordPost,
  loadresetpassword,
  resetPassword

}