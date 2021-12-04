
require('dotenv').config()

const mongoose = require("mongoose");
const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//My routers
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");





//! this is my db connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB connected");
}).catch(   
    console.log('helo database error')
)

//this is my middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



//!this is my routes

app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes);




//this is my port 
const port =  process.env.PORT || 8000;

// this is my listen server
app.listen(port,()=>{
    console.log(`concetip  success ${port}`);
})
