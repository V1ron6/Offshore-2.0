import React from 'react'
import {Link} from 'react-router-dom'
import Button from '../components/Button'
import "../index.css"
const HeaderBeforeLogin = () => {
	return (
		<nav className="bg-linear-to-r from-red-600 to-red-400 text-white sticky top-0 z-50 shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16 prefFont">
						<h1 className="text-3xl font-bold prefFont">OFFSHORE</h1>
						<div className="flex gap-4">
							<Link to="/login">
								<Button variant="secondary" size="sm">
									Sign In
								</Button>
							</Link>
							<Link to="/signup">
								<Button variant="danger" size="sm" className="bg-red-400 text-red-600 hover:bg-white hover:text-black">
									Get Started
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>
	)
}

export default HeaderBeforeLogin