const todoLstorage = require('../Models/todo.model.js')

//get all todos
const getTodo =  (req,res)=>{
	try{
	res.status(200).json({todo : todoLstorage});
	}catch(error){
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
}

//get completed
const getCompleted = (req,res)=>{
	try{
		const complete = todoLstorage.filter((t) => t.completed === true);
		res.status(200).json({todo : complete});
	}catch(error){
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
}


//get active  todos
const getActive = (req,res)=>{
	try{
		const uncomplete = todoLstorage.filter((t) => t.completed === false);
		res.status(200).json({todo: uncomplete});
	}catch(error){
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
}

const createTodo = (req,res)=>{
	try{
		if(!req.body || !req.body.task || typeof req.body.completed !== 'boolean'){
			return res.status(400).json({error:"task and completed required, completed must be boolean"});
		}
		const newTodo = { id: Date.now(), ...req.body };
		todoLstorage.push(newTodo);
		res.status(201).json(newTodo);
	}catch(error){
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
}

/* const updateTodo =(req,res)=>{
	try{
 const id = req.params.id ;
 const upated = todoLstorage.findByIdAndUpdate(id,req.body);
 res.status(200).json(updated);


	}catch(errror){
		console.log(error)
	}
}

*/

module.exports = {
	getTodo,
	getCompleted,
	getActive,
	createTodo
};