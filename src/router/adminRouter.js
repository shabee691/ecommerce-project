const express =require ("express")
const adminController = require ("../controllers/adminController")
const ProductController =require ("../controllers/productController")

const multer = require("../../middleware/multer")
adminRouter = express()
adminRouter.set("views","./src/views/admin")

//uplaod multer function
const uplaod =multer.multerUplaod()

//adminRouter
adminRouter.get("/dashboard",adminController.Dashboardget)
            .post("/dashboard",)
            .get("/users",adminController.usersget)

//category
adminRouter.get("/category",adminController.categoryget)
            .patch('/blockcategory/:id',adminController.blockCategory)
            .get("/addcategory",adminController.addcategoryget)
            .post("/addcategory",adminController.addcategorypost)

//ProductRouter
adminRouter.get("/product",ProductController.productload)
            .get("/addproduct",ProductController.addproductload)
             .post("/addproduct",uplaod.array('image',4),ProductController.addproduct)
             .get("/editproduct",ProductController.editProductLoad)
             .post("/editproduct",uplaod.array('image',4),ProductController.editProductPost)
             .get("/deleteproduct/:id",ProductController.deleteProduct)

module.exports = adminRouter;



