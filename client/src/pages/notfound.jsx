import {Link} from 'react-router-dom'

const Notfound=()=> {
	return (
		<>
		<div className=" align-center w-fit h-fit border-2 border-grey-300  shadow-2xl p-10 m-10 bg-white  rounded-md align-center dark:bg-black text-white md:w-fit md:h-fit "  >

			<h1 className='text-9xl font-bold text-center hover:animate-bounce '>404</h1>
			<h2 className='text-7xl text-center font-semibold capitalize hover:cursor-not-allowed'>page not found</h2>
<Link to={"/"}>
   <button className="border-2 rounded-md p-2 m-4 w-50 h-15 hover:shadow-2xl  hover:bg-white hover:text-black font-thin capitalize dark:text-white">go home</button>
</Link>
		</div>
		
		</>
	)
}

export default Notfound