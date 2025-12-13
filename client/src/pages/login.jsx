import React from 'react'
import {Link} from 'react-router-dom';
import Offshorelogo from '../assets/Offshorelogo.jpg'
const Login=()=> {
	return (
		<>
		<div className="flex min-h-screen items-center justify-center border-1">
			<div>
			<div className='relative bottom-10 border-1 z-1'>
				<h1 className='font-bold text-2xl relative bottom-8 text-center z-{-1}'>Off<span className='text-red-300 '>Shore</span></h1>
			</div>
				
			<form action="" className=" z-{-1} border-2 p-4 h-80 rounded-md relative botom-16" >
				<div className="z-1 relative top-20">
				<div className="border-1 rounded-md">
					<Link to={"/signup"}>
					<button className=" m-1 w-30 border-1 p-1 rounded-md">Signup</button>
					</Link>
						<Link to={"/login"}>
					<button className="m-1 w-30 border-1 p-1 rounded-md" >Login</button>
					</Link>
				</div>
				<div className="border-1 relative bottom-0 m-1">
					<label>Username:</label>
					<br />
					<input type="text" name="username" className="border-1 " />
					<br />
					<label >password</label>
					<br />
					<input type="password" name="password" className="border-1"/>
					<br />
				</div>
			</div>
			</form>

			</div>
			</div>

		</>
	)
}

export default Login;