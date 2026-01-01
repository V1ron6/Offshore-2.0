import '../index.css'
import Logo from '../assets/offShoreLogo.jpg'
const Footer=()=>{
	return(
		<>
			<footer className="bg-gray-900 text-gray-400 border-t border-gray-800 prefFont">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<img src={Logo} className='w-14 h-14 rounded-lg hover:w-28 hover:h-28  transition' />
							<h4 className="text-white font-bold mb-4">About Offshore</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">About Us</a></li>
								<li><a href="#" className="hover:text-white transition">Careers</a></li>
								<li><a href="#" className="hover:text-white transition">Blog</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-bold mb-4">Customer Service</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">Contact Us</a></li>
								<li><a href="#" className="hover:text-white transition">Returns</a></li>
								<li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-bold mb-4">Policies</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
								<li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
								<li><a href="#" className="hover:text-white transition">Security</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-bold mb-4">Follow Us</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">Facebook</a></li>
								<li><a href="#" className="hover:text-white transition">Twitter</a></li>
								<li><a href="#" className="hover:text-white transition">Instagram</a></li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 pt-8 text-center">
						<p>&copy; 2025 offshore. All rights reserved.</p>
						<p className="text-sm mt-2 ">\_/</p>
					</div>
				</div>
			</footer>
		</>
	)
}

export default Footer;