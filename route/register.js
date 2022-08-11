const Route = require("express").Router();
const bcrypt = require("bcrypt");
// const { User } = require("../model/user");
const { User, validateRegister } = require("../model/user");

Route.post("/register", async (req, res) => {
	// console.log(req.body);
	//  the data varable is equal user data
	const RegisterData = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	};

	const { error, value } = validateRegister(RegisterData);

	// note this logs all the error because abortEarly is false in joi

	if (error) return res.status(200).json(error.details);

	// return	console.log(RegisterData , error);

	//  checking to no if the name already exist
	const nameCheck = await User.findOne({ name: RegisterData.name }); //
	if (nameCheck) return res.status(400).json("Name already Exist ⚡");
	//  checking to no if the email already exist

	const emailCheck = await User.findOne({ email: RegisterData.email }); //
	if (emailCheck) return res.status(400).json("Email already Exist ⚡");
	//

	//  bcrypt
	console.log(RegisterData.password);
	const salt = await bcrypt.genSalt(10);
	RegisterData.password = await bcrypt.hash(RegisterData.password, salt);

	//

	const userMoudel = new User(RegisterData);
	try {
		const Newuser = await userMoudel.save();
		console.log(Newuser);
		res.json("success registration ");
	} catch (error) {
		res.status(400).json(error);
	}
});

// Route.get("/register", (req, res) => {
// 	res.json("god");
// });
module.exports = Route;
