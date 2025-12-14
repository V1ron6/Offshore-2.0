const defaultUser =require("../Models/user.model.js")

/*function locater(user,password,res){
	for(i=0;i < defaultUser.length ; i++){
 if(user==defaultUser.username || password ==defaultUser.password){
		res.statue(200).json({message :"welcome viron"})

	}else{
		res.status(404).json({error:"account does not exist"})
	}
	}

}*/

const verUser=(req,res)=>{
const {userName,username,password}=req.body
const user =userName || username;
if(!user || !password){
		res.status(404).json({error:'empty credentials'})
}

//locater(user,password,res);
const verify = defaultUser.find(t=>t.userName==user && t.password==password )
if(verify){
	return res.status(200).json({message:`welcome ${user}`,success: true})
}else{
	return res.status(404).json({message:`${user} not found`,success: false})
}
}


module.exports =verUser