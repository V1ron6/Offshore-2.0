require("dotenv").config();
const express =require("express");
const app = express();
const morgan = require("morgan")
const path = require('path');
const port =process.env.PORT || 3000
const todoRoute = require("./Routes/todo.route.js")
//middle wares
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(morgan("dev"))

//todo route
app.use("/api/todo",todoRoute);



app.get("/",(req,res)=>{
	res.send("adey active my guy")
})


app.listen(port,()=>{
	console.log(`active on ${port}`)

})