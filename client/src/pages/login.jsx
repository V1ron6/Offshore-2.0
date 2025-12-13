import React from 'react'
import {Link} from 'react-router-dom';
import Offshorelogo from '../assets/Offshorelogo.jpg'
const button = " m-1 w-30 border border-black p-1 logoColor rounded-md"
const buttonCenter =button + " w-60"


const Login=()=> {
	return (
		<>
		<div className="flex min-h-screen items-center justify-center border prefFont">
			<div>
			<div className='relative bottom-10  z-1'>
				<h1 className='font-bold text-5xl relative bottom-8 text-center z-{-1}'>Off<span className='text-red-300 '>Shore</span></h1>
			</div>
				
			<form action="" className=" z-{-1} border-2 p-4 h-100  rounded-md relative botom-16" >
				<div className="z-1 relative top-10 ">
				<div className="border rounded-md flex justify-evenly">
					<Link to={"/signup"}>
					<button className=" m-1 w-30 border border-black p-1 logoColor rounded-md">Signup</button>
					</Link>
						<Link to={"/login"}>
					<button className={button} >Login</button>
					</Link>
				</div>
				<div className="border relative bottom-0 m-1 p-4  justify-center ">
					<label >Username:</label>
					<br />
					<input type="text" name="username" className="border rounded-lg m-2 p-1" />
					<br />
					<label >Password</label>
					<br />
					<input type="password" name="password" className="border rounded-lg m-2 p-1"/>
					<br />
					<input type="submit" name="login" value="login" className={buttonCenter} />
				</div>
			</div>
			</form>

			</div>
			</div>

		</>
	)
}

export default Login;