const address = require("../../models/address")
const addaddress = async (req, res) => {
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
        await address.findOneAndUpdate(
            { user: userId },
            { $set: { user: userId }, $push: { address: data } },
            { upsert: true, new: true }
        );
        res.json({add:true})
        res.redirect('/success');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const addaddressprofile = async (req,res)=>{
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
        res.json({ adds: true, address: updatedAddress });

    } catch (error) {
        console.error(error);
        res.status(500).json({ adds: false, error: "Internal Server Error" });
    }
}

const success = async(req,res)=>{
    try {
        res.render('success')
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    addaddress,
    addaddressprofile,
    success,
    
    
}