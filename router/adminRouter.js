const express =require ("express")
const adminController = require ("../controllers/adminController")
const ProductController =require ("../controllers/productController")
const bannerController =require("../controllers/bannerController")
const couponController = require ("../controllers/couponController")
const multer = require("../middleware/multer")
adminRouter = express()
adminRouter.set("views","./views/admin")
//uplaod multer function
const uplaod =multer.multerUplaod()
const bannerUpload = multer.BannerUplaod()

//adminRouter
adminRouter .get("/dashboard",adminController.Dashboardget)
            .post("/dashboard",)
            .get("/users",adminController.usersget)
//category
adminRouter .get("/category",adminController.categoryget)
            .patch('/blockcategory/:id',adminController.blockCategory)
            .get("/addcategory",adminController.addcategoryget)
            .post("/addcategory",adminController.addcategorypost)
            .get("/editcategory",adminController.editcategoryLaod)
            .post("/editcategory",adminController.editcategoryPost)
            .get("/deletecategory/:id",adminController.deleteCategory)
//ProductRouter
adminRouter  .get("/product",ProductController.productload)
             .get("/addproduct",ProductController.addproductload)
             .post("/addproduct",uplaod.array('image',4),ProductController.addproduct)
             .get("/editproduct",ProductController.editProductLoad)
             .post("/editproduct",uplaod.array('image',4),ProductController.editProductPost)
             .get("/deleteproduct/:id",ProductController.deleteProduct)

//coupon
adminRouter .get("/coupon",couponController.couponLoad)
            .get("/addcoupon",couponController.addcouponLoad)
            .post("/addcoupon",couponController.addcouponPost)
            .get("/editcoupon",couponController.editcouponLoad)
            .post("/editcoupon",couponController.editcouponPost)
            .get("/deletecoupon/:id",couponController.couponDelete,)

//Banner
adminRouter .get("/banner",bannerController.bannerLoad)   
            .get("/addbanner",bannerController.addbanner)  
            .post("/addbanner",bannerUpload.single('image'),bannerController.addbannerPost) 
            .get("/editbanner",bannerController.editbannerLoad)
            .post("/editbanner",bannerUpload.single('image'),bannerController.editbannerPost)  
            .get("/bannerdelete/:id",bannerController.bannerdelete)    
//Order
adminRouter .get("/order",adminController.orderLoad)
            .get('/showorder',adminController.showorderLoad) 
            .post('/updateProductStatus',adminController.ProductStatus)           


module.exports = adminRouter;



