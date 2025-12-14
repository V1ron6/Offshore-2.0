const cors =require("cors")

const allowedOrigins =[
	"http://localhost:5173",
	"http://localhost:4000",
	"http://localhost:3000"
]
const corOptions ={
	origin: function(origin,callback){
		if(!origin || allowedOrigins.indexof(origin) !== -1) {
			callback(null,true)
		}else{
			callback(new Error('not allowed by cors'))
		}
	},credentials:true
}

