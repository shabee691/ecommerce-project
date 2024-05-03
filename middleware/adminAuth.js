const admin = async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            next()
        }else(
            res.redirect("/admin")
        )
    }catch{
        res.status(500)
    }
}
 
module.exports={
    admin
}