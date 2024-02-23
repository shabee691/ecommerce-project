const express=require("express")
const userRouter=express()
userRouter.set("views","./src/views/user")
const userController = require("../controllers/usercontroller")




//UserRouter
userRouter.get("/",userController.signupget)
            .post("/",userController.signupPost)
            .get("/login",userController.loginget)
            .post("/login",userController.loginpost)
            .get("/verifyotp",userController.otpverificationget)
            .post("/verifyotp",userController.otpverificationpost,)
            

module.exports=userRouter;