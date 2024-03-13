const multer = require ("multer")

function multerUplaod() {
const productStorage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,"public/assets/images/products/original") 
}, 
    filename:function(req,file,cb){
        const filename = file.originalname;
        cb(null,Date.now()+"-"+filename)
    }
    
})
const uploadmulter =multer ({storage:productStorage});
    return uploadmulter
}

function BannerUplaod(){
    const BannerStorage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"public/assets/images/banner")
        },
        filename:function(req,file,cb){
            const filename = file.originalname
            cb(null,Date.now()+"-"+filename)

        }
       

    })
    const bannerupload =multer ({storage:BannerStorage});
    return bannerupload
}

 
module.exports={
    multerUplaod,
    BannerUplaod
 }
