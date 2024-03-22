const Coupon = require("../models/coupon")
const Cart = require("../models/cart")
const couponLoad = async (req,res)=>{
    try{
        const coupon= await Coupon.find({})
        res.render("coupon",{coupon})
    }
    catch(err){
        console.log(err,"couponLoad")
    }
}
const addcouponLoad = async (req,res)=>{
    try{
        
        res.render("addcoupon")
    }
    catch(err){
        console.log(err,"addcouponLoad")
    }


}
const addcouponPost = async(req,res)=>{
    try{
        const existCoupon= await Coupon.findOne({couponCode:req.body.couponCode})
        if(existCoupon){
            res.render("coupon",{error:"coupon already is existed"})
        }
        const couponD = req.body
        const coupon = new Coupon({
            name: req.body.name,
            couponCode: req.body.couponCode,
            discountPercentage: req.body.discountPercentage,
            maxDiscountAmount:req.body.maxDiscountAmount,
            activationDate: req.body.activationDate,
            expiryDate: req.body.expiryDate,
            criteriaAmount: req.body.criteriaAmount,
        })
        await coupon.save()
        res.redirect("/admin/coupon")
    }
    catch(err){
        console.log(err,"addcouponPost")
    }
}
const editcouponLoad = async (req,res)=>{
    try{
        const couponid = req.query.id
        const coupon = await Coupon.findOne({_id:couponid})
        res.render("editcoupon",{coupon})
    }
    catch(err)
    {
        console.log(err,"editcouponLoad")
    }
}
const editcouponPost =async (req,res)=>{
    try{
            const couponid = req.body._id
            const update =  {
            name: req.body.name,
            couponCode: req.body.couponCode,
            discountPercentage: req.body.discountPercentage,
            maxDiscountAmount:req.body.maxDiscountAmount,
            expiryDate: req.body.expiryDate,
            criteriaAmount: req.body.criteriaAmount,
               
            }
            await Coupon.findOneAndUpdate({_id:couponid},update)
            res.redirect("/admin/coupon")
    }
    catch(err)
    {
        console.log(err,"editcouponPost")
    }
}


const couponDelete = async (req,res)=>{
    try {
        const couponId= req.params.id
         await Coupon.findByIdAndDelete(couponId)
        res.redirect("/admin/coupon")

    }
    catch (err){
        console.log(err,"couponDelete")
    }
}
const couponCheck= async (req,res)=>{
    try {
        const userId = req.session.user_id;
        const couponcode = req.body.coupon;
        const currentDate = new Date()
        const cartData = await Cart.findOne({user:userId})
        const cartTotal = cartData.product.reduce((acc,val)=>acc+val.totalPrice,0)
        const coupondata = await Coupon.findOne({couponCode:couponcode})
        console.log(coupondata);
        if(coupondata){
            if(currentDate >= coupondata.activationDate && currentDate <= coupondata.expiryDate){
                const exists = coupondata.usedUsers.includes(userId)
                if(!exists){
                    if(cartTotal>=coupondata.criteriaAmount){
                        await Coupon.findOneAndUpdate({couponCode:couponcode},{$push:{usedUsers:userId}})
                        await Cart.findOneAndUpdate({user:userId},{$set:{couponDiscount:coupondata._id}})
                        res.json({coupon:true})
                    }else{
                        res.json({coupon:'amountIssue'})
                    }
                }else{
                    res.json({coupon:'used'})
                }
            }else{
                res.json({coupon:'notAct'})
            }
        }else{
            res.json({coupon:false})
        }
        
    } catch (error) {
        console.log(error);
    }
}
const removecoupon = async (req,res)=>{
    try {
        const userId = req.session.user_id;
        const cartData = await Cart.findOne({user:userId})
        await Coupon.findOneAndUpdate({_id:cartData.couponDiscount},{$pull:{usedUsers:userId}})
        await Cart.findOneAndUpdate({user:userId},{$set:{couponDiscount:0}})
        res.json({remove:true})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}

module.exports={
    couponLoad,
    addcouponLoad,
    addcouponPost,
    couponDelete,
    editcouponLoad,
    editcouponPost,
    couponCheck,
    removecoupon
}