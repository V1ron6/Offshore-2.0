const express = require("express")
const router = express.Router()
const verUser = require("../Controllers/user.controller.js")

router.post("/",verUser)

module.exports =router