const express=require("express")
const app=express()
const mongoose=require("mongoose")
const flash = require("connect-flash")

const path =require("path")
const session=require("express-session")
require("dotenv").config()


const userRouter=require("./router/userRouter")//USer router
const adminRouter =require("./router/adminRouter") //admin Router



app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized: false
}))
const port=process.env.PORT 

app.use(flash())

mongoose.connect(process.env.MONGOOB_URL).then(()=>{
    console.log("wawh mongoose connected");
}).catch((err)=>{
    console.log("hell not connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public',express.static(path.join(__dirname,'public')))

app.set("view engine","ejs")

const nocache=require("nocache")
app.use(nocache())

app.use("/",userRouter)
app.use("/admin",adminRouter)

app.listen(port,()=>{
    console.log(`port ${port} server is running`)
})