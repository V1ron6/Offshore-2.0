const todoLstorage = require('../Models/todo.model.js')

//get all todos
const getTodo =  (req,res)=>{
	try{
	res.status(200).json(todoLstorage);
	}catch(error){
console.log(error)
}
}

//get completed
const getCompleted = (req,res)=>{
try{
	const complete = todoLstorage.filter((t) => t.completed === true);
  res.json(complete); // Custom Read!
}catch(error){
console.log(error)
}
}


//get active  todos
const getActive = (req,res)=>{
try{
	const complete = todoLstorage.filter((t) => t.completed === false);
  res.json(complete); // Custom Read!
}catch(error){
console.log(error)
}
}

const createTodo = (req,res)=>{
	try{
		 const newTodo = { id: todoLstorage.length + 1, ...req.body }; // Auto-ID
  if(!req.body || typeof req.body.completed !== 'boolean' ){
    return res.status(400).json({error:"task and completed required ,completedmust be boolean"});
  }
  todoLstorage.push(newTodo);
  res.status(201).json(newTodo); // Echo back
}catch(error){
		console.log(error);
	}
}

const updateTodo =(req,res)=>{
	try{
 const id = req.params.id ;
 const upated = todoLstorage.findByIdAndUpdate(id,req.body);
 res.status(200).json(updated);


	}catch(errror){
		console.log(error)
	}
}



module.exports ={
	getTodo,
	getCompleted,
	getActive,
	createTodo,
	updateTodo

}