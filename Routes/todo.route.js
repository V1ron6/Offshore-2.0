const express  = require("express")
const router = express.Router();
const {
	getTodo,
	 getCompleted,
	 getActive,
	 createTodo,
	 updateTodo
	
	} = require('../Controllers/todo.controller.js');


router.get("/",getTodo);
router.get("/completed",getCompleted);
router.get("/active",getActive);
router.post("/",createTodo);
router.patch("/:id",updateTodo);
















module.exports =router