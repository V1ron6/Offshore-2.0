require("dotenv").config();
const express =require("express");
const app = express();
const morgan = require("morgan")
const port = process.env.PORT || 3000
const cors = require("cors")
const todoRoute = require("./Routes/todo.route.js")
const userRoute = require("./Routes/user.route.js")


//middle wares
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors({
	origin: "http://localhost:5173",
	credentials:true,
	methods:'GET,POST,PUT,HEAD,PATCH,DELETE',
	allowedHeaders:["Content-Type"]
}));
app.use(morgan("combined"))


//todo route
app.use("/api/todo",todoRoute);

//userAccountRoute
app.use("/api/user",userRoute)

app.get("/",(req,res)=>{
res.send("hello")
})
	

/*
console.log('@req.parrams')


*/

app.listen(port,()=>{
	console.log(`active on ${port}`)
  }
)