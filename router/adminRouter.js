const express =require ("express")
const adminController = require ("../controllers/adminController")
const ProductController =require ("../controllers/productController")
const bannerController =require("../controllers/bannerController")
const couponController = require ("../controllers/couponController")
const multer = require("../middleware/multer")
const auth = require("../middleware/adminAuth")
adminRouter = express()
adminRouter.set("views","./views/admin")
//uplaod multer function
const uplaod =multer.multerUplaod()
const bannerUpload = multer.BannerUplaod()

//adminRouter
adminRouter .get('/',adminController.loadadmin)
            .post('/',adminController.verifyLogin)
            .get("/dashboard",auth.admin,adminController.Dashboardget)
            .post("/dashboard")
            .get("/users",auth.admin,adminController.usersget)
            .get('/report',adminController.loadreport)
            .patch('/blockusers/:id',adminController.blockUser)
            .get('/logout',auth.admin,adminController.adminLogout)
//category
adminRouter .get("/category",auth.admin,adminController.categoryget)
            .patch('/blockcategory/:id',auth.admin,adminController.blockCategory)
            .get("/addcategory",auth.admin,adminController.addcategoryget)
            .post("/addcategory",auth.admin,adminController.addcategorypost)
            .get("/editcategory",auth.admin,adminController.editcategoryLaod)
            .post("/editcategory",auth.admin,adminController.editcategoryPost)
            .get("/deletecategory/:id",auth.admin,adminController.deleteCategory)
//ProductRouter
adminRouter  .get("/product",auth.admin,ProductController.productload)
             .get("/addproduct",auth.admin,ProductController.addproductload)
             .post("/addproduct",auth.admin,uplaod.array('image',4),ProductController.addproduct)
             .get("/editproduct",auth.admin,ProductController.editProductLoad)
             .post("/editproduct",auth.admin,uplaod.array('image',4),ProductController.editProductPost)
             .get("/deleteproduct/:id",auth.admin,ProductController.deleteProduct)

//coupon
adminRouter .get("/coupon",auth.admin,couponController.couponLoad)
            .get("/addcoupon",auth.admin,couponController.addcouponLoad)
            .post("/addcoupon",auth.admin,couponController.addcouponPost)
            .get("/editcoupon",auth.admin,couponController.editcouponLoad)
            .post("/editcoupon",auth.admin,couponController.editcouponPost)
            .get("/deletecoupon/:id",auth.admin,couponController.couponDelete,)

//Banner
adminRouter .get("/banner",auth.admin,bannerController.bannerLoad)   
            .get("/addbanner",auth.admin,bannerController.addbanner)  
            .post("/addbanner",auth.admin,bannerUpload.single('image'),bannerController.addbannerPost) 
            .get("/editbanner",auth.admin,bannerController.editbannerLoad)
            .post("/editbanner",auth.admin,bannerUpload.single('image'),bannerController.editbannerPost)  
            .get("/bannerdelete/:id",auth.admin,bannerController.bannerdelete)    
//Order
adminRouter .get("/order",auth.admin,adminController.orderLoad)
            .get('/showorder',auth.admin,adminController.showorderLoad) 
            .post('/updateProductStatus',auth.admin,adminController.ProductStatus)     
            .get('/chart',auth.admin,adminController.chartData)
            .get('/paymentChart',auth.admin,adminController.paymentChartData)      

 
module.exports = adminRouter;



