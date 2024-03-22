const Review = require ("../models/review")
const addreview = async(req,res)=>{
    try {
        const userId=req.session.user_id;
        const {productId,reviewText,starRating,orderId}=req.body;
        const rating=parseInt(starRating);

        const review=new Review({
            productId,userId,rating,comment:reviewText
        });
        await review.save()
        res.redirect(`/orderdetails?id=${orderId}`);
        
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' })
        
    } 
}
const editReviewLoad = async (req,res)=>{
    try {
        const { productid,orderid} = req.query;
        const userId = req.session.user_id;
        const review = await Review.findOne({productId:productid,userId})
        console.log(productid,review)
        res.json({review,orderid,productid});

    } catch (error) {
        console.log(error);
    }
}
const editReview = async (req,res)=>{
    try {
        const userId = req.session.user_id;
        const productId = req.body.productId;
        const comment =req.body.reviewText;
        const orderId = req.body.orderId;
        console.log(req.body)
         await Review.findOneAndUpdate(
                { productId: productId, userId },
                { $set: { comment: comment } },
              );

          
          res.redirect(`/orderdetails?id=${orderId}`);
    } catch (error) {
        console.log(error);
    }

}

module.exports={
    addreview,
    editReviewLoad,
    editReview
}