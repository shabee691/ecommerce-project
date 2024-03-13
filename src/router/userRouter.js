const express=require("express")
const userRouter=express()
userRouter.set("views","./src/views/user")
const userController = require("../controllers/usercontroller")
const cartController = require ("../controllers/cartController")
const wishlistController = require("../controllers/wishlistController")
const addressController =require ("../controllers/addressController") 



//UserRouter
userRouter  .get("/",userController.homeLoad)
            .post("/")
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
            .get("/product",userController.productLoad)
            .get("/wishlist",wishlistController.wishlistLoad)
            .patch("/addwishlist",wishlistController.addWishlist)
            .get("/checkout",cartController.loadcheckout)
            .post('/addaddresses',addressController.addaddress)
            .get('/success',addressController.success)
            

            
            

module.exports=userRouter;