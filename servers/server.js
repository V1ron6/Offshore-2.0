require("dotenv").config();
const express =require("express");
const app = express();
const morgan = require("morgan")
const path = require('path');
const fs = require('fs')
const port =process.env.PORT || 3000
const todoRoute = require("./Routes/todo.route.js")
//middle wares
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(morgan("combined"))
app.use(express.static(path.join(__dirname,"front-end")))

//todo route
app.use("/api/todo",todoRoute);



app.get("/",(req,res)=>{
	res.sendFile(path.join(__dirname,'front-end','index.html'))
})
	

/*
console.log('@req.parrams')


*/

app.listen(port,()=>{
	console.log(`active on ${port}`)

}
 )