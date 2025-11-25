import { useState, useEffect} from 'react';

const  Signup=() =>{
	const {signUpper,setsignUpper} = useState([]);

useEffect(()=>{
		
	async function getter(){
	try{
		const res = await fetch('/api/todo/');
  	const data = await res.json();
    setsignUpper(data);
    alert(data)
		}catch(error){
			console.log(error)
		}
		}
		getter();
	}, []);

	return (
<>
		<div>signUp</div>
		{!signUpper ?(
			<p>loading.....</p> 
		) : (
			signUpper.todo.map((todo,i)=>{
				<p key={i}>{todo}</p>
		}))
	}
	</>
	)
};

export default Signup;