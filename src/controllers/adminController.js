
const Category = require ("../../models/categories")
const USerss = require("../../models/signup")
const Product = require("../../models/addproduct")


const Dashboardget = async function (req,res) {
        
            const totalRevenueNumber = []; // Replace with your actual revenue value
            const ordercount = []; // Replace with your actual order count
            const productcount = []; // Replace with your actual product count
            const categorycount = []; // Replace with your actual category count
            const monthlyRevenueNumber = []; // Replace with your actual monthly revenue
            const orders = [
              {
                _id: "order1",
                userId: { name: "John Doe" },
                purchaseDate: "2024-01-25",
                paymentMethod: "Credit Card",
                products: [
                  { name: "Product 1", price: 20 },
                  { name: "Product 2", price: 30 },
                ],
              },
              // Add more orders as needed
            ];
            
            res.render("dashboard",
            {
                totalRevenueNumber,
                ordercount,
                productcount,
                categorycount,
                monthlyRevenueNumber,
                orders,
              })
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
    catch{

    }
}










module.exports = {
    Dashboardget,
    Dashboardpost,
    categoryget,
    blockCategory,
    addcategoryget,
    addcategorypost,
    usersget,
   
    
    
    
}