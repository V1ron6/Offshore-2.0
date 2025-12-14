import axios from 'axios';
import {Link} from 'react-router-dom';
import Offshorelogo from '../assets/Offshorelogo.jpg'
const button = " m-1 w-30 border border-black p-1 logoColor rounded-md"
const buttonCenter =button + " w-60"

const handleSubmit = async (e)=>{ e.preventDefault();
const formData ={
username: e.target.userName.value,
password: e.target.password.value
};
try {
const response =await  axios.post('http://localhost:4000/api/user',formData)
console.log(response.data)
}catch(error){

console.error(error.response?.data || error)
}

};
const Login=()=> {
	return (
		<>
		<div className="flex min-h-screen items-center justify-center border prefFont">
			<div>
			<div className='relative bottom-10  z-1'>
				<h1 className='font-bold text-5xl relative bottom-8 text-center z-{-1}'>Off<span className='text-red-300 '>Shore</span></h1>
			</div>
				<div className="border rounded-md flex justify-evenly relative top-14 ">
					<Link to={"/signup"}>
					<button className=" m-1 w-30 border border-black p-1 logoColor rounded-md">Signup</button>
					</Link>
						<Link to={"/login"}>
					<button className={button} >Login</button>
					</Link>
				</div>
			<form onSubmit={handleSubmit}  className=" z-{-1} border-2 p-4 h-100  rounded-md relative botom-16" >
				<div className="z-1 relative top-10 ">
				
				<div className="border relative bottom-0 m-1 p-4  justify-center ">
					<label >Username:</label>
					<br />
					<input type="text" name="userName" className="border rounded-lg m-2 p-1" />
					<br />
					<label >Password</label>
					<br />
					<input type="password" name="password" className="border rounded-lg m-2 p-1"/>
					<br />
					<input type="submit" name="login" value="login" className={buttonCenter} onClick={console.log("started")} />
				</div>
			</div>
			</form>

			</div>
			</div>

		</>
	)
}

export default Login;