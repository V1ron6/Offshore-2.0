

const header=()=>{
	return(
		<>
		<header className="bg-red-300 h-14  flex justify-space-between  w-full border-b-2 border-grey-200 rounded-b-md ">
			<div>
					<h1 className="justify-end text-lg  p-2">Offshore</h1>
			</div>
		  <div className="h-7 w-16  border-1 rounded-md m-2">
				<button className="pl-4 text-black  dark:text-white hover:text-white ">login</button>
				</div> 
		</header>
		</>

	)
}
export default  header;