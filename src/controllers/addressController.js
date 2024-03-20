const address = require("../../models/address")
const addaddress= async (req,res)=>{
    try {
        const userId = req.session.user_id;

        const data = {
            fullName: req.body.fullName,
            country: req.body.country,
            housename: req.body.housename,
            state: req.body.state,
            city: req.body.city,
            pincode: req.body.pincode,
            phone: req.body.phone,
            email: req.body.email
        };

        // Update the address
        const updatedAddress = await address.findOneAndUpdate(
            { user: userId },
            { $set: { user: userId }, $push: { address: data } },
            { upsert: true, new: true }
        );

        // Send a JSON response
        res.json({ add: true, address: updatedAddress });

    } catch (error) {
        console.error(error);
        res.status(500).json({ add: false, error: "Internal Server Error" });
    }
}
const deleteaddress = async (req,res)=>{
    try {
        const userId=req.session.user_id
        const addressId = req.body.id
   
        await address.updateOne({user:userId},{$pull:{address:{_id:addressId}}})
   
       res.json({deleted:true})
    } catch (error) {
        
    }
  }
  const editaddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
         await address.findOneAndUpdate(
            { user: userId, 'address._id': req.body.addressId },
            {
                $set: {
                    'address.$.fullName': req.body.fullName,
                    'address.$.country': req.body.country,
                    'address.$.housename': req.body.housename,  
                    'address.$.state': req.body.state,
                    'address.$.city': req.body.city,
                    'address.$.pincode': req.body.pincode,
                    'address.$.phone': req.body.phone,
                    'address.$.email': req.body.email,
                },
            },
            { new: true } 
        );
  
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

const success = async(req,res)=>{
    try {
        res.render('success')
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    addaddress,
    success,
    deleteaddress,
    editaddress
    
    
}