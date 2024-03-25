
const Category = require ("../models/categories")
const USerss = require("../models/signup")
const Product = require("../models/addproduct")
const Order = require("../models/order")


const Dashboardget = async function (req,res) {
        
  try {
    const ordercount = await Order.countDocuments();
    const productcount = await Product.countDocuments();
    const categorycount = await Category.countDocuments();
    const order = await Order.find().populate('userId');

    const totalrevenue = await Order.aggregate([
        {
            $match: {
                'products.productstatus': 'Delivered' 
            }
        },
        {
            $group: {
                _id: null,
                totalrevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const totalRevenueNumber = totalrevenue.map(result => result.totalrevenue)[0] || 0;

    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    const monthlyrevenue = await Order.aggregate([
        {
            $match: {
                'products.productstatus': 'Delivered', 
                purchaseDate: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            }
        },
        {
            $group: {
                _id: null,
                monthlyrevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const monthlyRevenueNumber = monthlyrevenue.map(result => result.monthlyrevenue)[0] || 0;

    res.render('dashboard', { ordercount, productcount, categorycount, totalRevenueNumber, monthlyRevenueNumber, order });
} catch (error) {
    console.log(error);
}
}
const Dashboardpost = async function (req,res){
    
} 

const categoryget = async function (req,res) {
    try {
        const category = await Category.find()
        res.render('categories',{category})
    } catch (error) {
        console.log(error);
    }

}

const blockCategory = async (req,res)=>{
    try {
        const categoryId = req.params.id; 
        console.log(categoryId);
        
        const categoryProduct = await Product.find({ categoryId: categoryId });
  console.log(categoryProduct);
  
        const userValue = await Category.findOne({ _id: categoryId });
        if (userValue.is_list) {
          await Category.updateOne({ _id: categoryId }, { $set: { is_list: false } });
          await Product.updateMany({categoryId:categoryId},{$set:{isCategoryBlocked:true}})
        } else {
          await Category.updateOne({ _id: categoryId }, { $set: { is_list: true } });
          await Product.updateMany({categoryId:categoryId},{$set:{isCategoryBlocked:false}})
  
        }
        res.json({ block: true });
      } catch (error) {
        console.log(error.message);
      }
}


const usersget = async function (req,res){
    try{
        const users = await USerss.find()
        res.render ("users",{users:users})
    }
   catch{
        console.log(error);
   }

}
const blockUser = async (req, res) => {
    try {
      const user = req.params.id;
      const userValue = await USerss.findOne({ _id: user });
      if (userValue.is_blocked) {
        await USerss.updateOne({ _id: user }, { $set: { is_blocked: false } });
      } else {
        await USerss.updateOne({ _id: user }, { $set: { is_blocked: true } });
        req.session.user_id = null;
      }
      res.json({ block: true });
    } catch (error) {
      console.log(error.message);
    }
  };


const addcategoryget = async function (req,res){
    res.render("addcategory")
   
}
const addcategorypost = async function (req,res){
    
    try{
        const name = req.body.name
        const description = req.body.description
            
          const categoryexist = await Category.findOne({
            name:{$regex:'.*'+ name +'.*', $options: 'i' }
          }) 

          console.log(categoryexist);
            if(!categoryexist){

                const category = new Category({
                    name,
                    description
                })
                await category.save()
                res.redirect("/admin/category")
               
            } 
            else{
                res.render("addcategory",{message:"category name is existed"})
            }
    }
    catch(err){
      console.log(err,"addcategoryPost");
    
}}
const deleteCategory = async (req,res)=>{
  try {
    const categoryId= req.params.id
     await Category.findByIdAndDelete(categoryId)
    res.redirect("/admin/category")

}
catch (err){
  console.log(err,"deletecategory");
}}
const editcategoryLaod = async(req,res)=>{
  try{
    const productid = req.query.id
    const categoryData = await Category.findOne({_id:productid})
    res.render("editcategory",{categoryData})
}
catch(err){
    console.log(err,':editcategoryload error');
}
}

const editcategoryPost = async(req,res)=>{
try{
  const categoryid = req.body.id 
  const categoryD = req.body 
  const update =  {
    name:categoryD.name,
    description:categoryD.description
}
await Category.findOneAndUpdate({_id:categoryid},update)
res.redirect("/admin/category")
}
catch (err){
  console.log(err,"editcategory");
}
  
}

const orderLoad = async (req,res)=>{
try{
 const order =await Order.find({}).sort({parchaseDate:-1})
 res.render("order",{order})
}catch(err){
  console.log(err)
}
}
const showorderLoad = async(req,res)=>{
  try {
    const id=req.query.id;
    const order=await Order.findOne({_id:id}).populate('products.productId')
    res.render('showorder',{order})
} catch (error) {
    console.log(error);
}
}

const ProductStatus = async (req,res)=>{
  try {
    const productid=req.body.productId;
    const productstatus=req.body.newStatus;
    const updateOrder=await Order.findOneAndUpdate(
        {
            'products._id':productid
        },
        {
            $set:{
                'products.$.productstatus':productstatus,
                 status:productstatus   
            }
        },
        {new:true}
    );
    res.json({success:true})
    console.log(updateOrder,"order",productstatus)
} catch (error) {
    console.log(error);
}
}

const chartData = async (req, res) => {
  try {
      const salesData = await Order.aggregate([
          {
              $match: { "products.productstatus": "Delivered" }
          },
          {
              $group: {
                  _id: { $month: "$purchaseDate" },
                  totalAmount: { $sum: "$totalAmount" },
              },
          },
          {
              $project: {
                  _id: 0,
                  month: "$_id",
                  totalAmount: 1,
              },
          },
          {
              $sort: { month: 1 },
          },
      ]);

      console.log(salesData);

      res.json(salesData);
  } catch (error) {
      console.error('Error fetching data from database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
const paymentChartData = async (req, res) => {
  try {
      const paymentData = await Order.aggregate([
          {
              $match: { "products.productstatus": "Delivered" }
          },
          {
              $group: {
                  _id: "$paymentMethod",
                  totalAmount: { $sum: "$totalAmount" },
              }
          },
      ]);

      console.log(paymentData);

      res.json(paymentData);
  } catch (error) {
      console.error('Error fetching payment data from the database:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



const loadreport = async(req,res)=>{
  try {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  if (startDate && endDate) {
       filteredSales = await Order.find({purchaseDate: { $gte: startDate, $lte: endDate }, "products.productstatus":"Delivered"} ).populate('userId');
  }else{
      filteredSales = await Order.find({"products.productstatus":"Delivered"} ).populate('userId');

  }
  res.render('report', { order: filteredSales ,startDate,endDate});
  } catch (error) {
      console.log(error);
  }
}





module.exports = {
    Dashboardget,
    Dashboardpost,
    categoryget,
    blockCategory,
    addcategoryget,
    addcategorypost,
    editcategoryLaod,
    editcategoryPost,
    usersget,
    blockUser,
    deleteCategory,
    orderLoad,
    showorderLoad,
    ProductStatus,
    chartData,
    paymentChartData ,
    loadreport
   
    
    
    
}