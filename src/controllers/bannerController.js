const Banner = require("../../models/banner")

const bannerLoad = async (req,res)=>{
try{
    const banner =await Banner.find()
    res.render("banner",{banner})
}
catch(er){

}
}

const addbanner = async(req,res)=>{
    try{
        res.render("addbanner")
    }
    catch(err){
        console.log("addbanner", err)
    }
}

const addbannerPost = async(req,res)=>{
    try{
        const bannerD = req.body
        const img = await req.file.filename
        const bannerSave = new Banner({
            title:bannerD.title,
            description:bannerD.description,
            image:img,
            targeturl:bannerD.targeturl
        })
        await bannerSave.save()
        res.redirect("/admin/banner")
    }
    catch(err) {
        console.log(err,"addbannerPost")
    }
}

const editbannerLoad =async (req,res)=>{
    try{
        const bannerid = req.query.id
        const data = await Banner.findOne({_id:bannerid})
        res.render("editbanner",{data})
    }
    catch(er){
        console.log(er,"editbannerLaod");
    }
}
const editbannerPost = async(req,res)=>{
try{
    const bannerid = req.query.id
    const bannerD = req.body 
    const img= await req.file.filename
    const update =  {
    title:bannerD.title,
    description:bannerD.description,
    image:img,
    targeturl:bannerD.targeturl
       
    }
    await Banner.findOneAndUpdate({_id:bannerid},update,)
    res.redirect("/admin/banner")
}
catch(er){
    console.log(er,"editbannerpost");
}
}

const bannerdelete = async(req,res)=>{
    const bannerId = req.params.id
    await Banner.findByIdAndDelete(bannerId)
    res.redirect("/admin/banner")
    
}



module.exports={
    bannerLoad,
    addbanner,
    addbannerPost,
    editbannerLoad,
    editbannerPost,
    bannerdelete
}