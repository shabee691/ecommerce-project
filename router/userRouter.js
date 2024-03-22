const express=require("express")
const userRouter=express()
userRouter.set("views","./views/user")
const userController = require("../controllers/usercontroller")
const cartController = require ("../controllers/cartController")
const wishlistController = require("../controllers/wishlistController")
const addressController =require ("../controllers/addressController") 
const couponController = require ("../controllers/couponController")
const orderController = require("../controllers/orderController")



//UserRouter
userRouter  .get("/",userController.homeLoad)
            .get("/signup",userController.signupget)
            .post("/signup",userController.signupPost)
            .get("/login",userController.loginget)
            .post("/login",userController.loginpost)
            .get("/verifyotp",userController.otpverificationget)
            .post("/verifyotp",userController.otpverificationpost,)
            .get("/shop",userController.shopLaod)
            .get("/cart",cartController.cartLoad)
            .patch("/addcart",cartController.addCart)
            .post("/updatecart",cartController.updateCart)
            .post("/removecartitem",cartController.removecartitem)
            .get("/product",userController.productLoad)
            .get("/account",userController.loadaccount)
            .get("/wishlist",wishlistController.wishlistLoad)
            .patch("/addwishlist",wishlistController.addWishlist)
            .get("/checkout",cartController.loadcheckout)
            .post("/placeorder",orderController.placeorder)
            .get("/orderdetails",orderController.loadorderdetail)
            .post('/addaddress',addressController.addaddress)
            .post("/addaddresses",addressController.addaddress)
            .delete("/deleteaddress",addressController.deleteaddress)
            .post("/editaddresses",addressController.editaddress)
            .post("/edituser",userController.edituser)
            .post("/passwordchange",userController.userpasswordChange)
            .get('/success',addressController.success)
            .post('/checkcoupon',couponController.couponCheck)
            .post("/removecoupon",couponController.removecoupon)
            .post("'/cancelproduct",orderController.cancelproduct)
            .post("/verifypayment",orderController.verifypayment)
            .get("/invoice",userController.invoice)
            .post('/returnproduct',orderController.returnproduct)
            .get('/search',userController.productSearch)
            
            
            

            
            

module.exports=userRouter;