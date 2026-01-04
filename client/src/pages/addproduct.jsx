/**
 * Add Product Page - Dedicated form for adding new products
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingScreen  from '../components/LoadingScreen.jsx'
const AddProductPage = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [images, setImages] = useState(['🎧']);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		stock: '',
		category: 'electronics',
		emoji: '🎧'
	});

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		if (!userData) {
			navigate('/login');
			return;
		}
		setUser(userData);
		setLoading(false);
	}, [navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleAddImage = (emoji) => {
		if (!images.includes(emoji)) {
			setImages([...images, emoji]);
		}
		setFormData({ ...formData, emoji });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.name || !formData.price || !formData.stock) {
			setError('Please fill in all required fields');
			return;
		}

		if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
			setError('Please enter a valid price');
			return;
		}

		if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
			setError('Please enter a valid stock quantity');
			return;
		}

		// Success message
		setSuccess(`✓ Product "${formData.name}" has been added successfully!`);
		
		// Reset form
		setFormData({
			name: '',
			description: '',
			price: '',
			stock: '',
			category: 'electronics',
			emoji: '🎧'
		});

		// Redirect after success
		setTimeout(() => {
			navigate('/dashboard');
		}, 2000);
	};

	if (loading) {
		return <LoadingScreen message="Loading Add Product" submessage="Preparing the form..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Top Bar */}
			<div className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
					<h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
					<button
						onClick={() => navigate('/dashboard')}
						className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
					>
						<ArrowLeft size={20} />
						Back
					</button>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Alerts */}
				{error && (
					<div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex justify-between items-center">
						<span>⚠️ {error}</span>
						<button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
							<X size={20} />
						</button>
					</div>
				)}

				{success && (
					<div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg">
						{success}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Preview */}
					<div className="lg:col-span-1">
						<Card className="sticky top-8">
							<div className="p-6">
								<h3 className="text-lg font-bold text-gray-900 mb-4">Product Preview</h3>
								
								{/* Product Card Preview */}
								<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
									<div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-6xl">
										{formData.emoji}
									</div>
									<h4 className="font-bold text-gray-900 mb-2 h-12 flex items-start">
										{formData.name || 'Product Name'}
									</h4>
									<p className="text-sm text-gray-600 mb-4 line-clamp-2">
										{formData.description || 'Product description will appear here'}
									</p>
									<div className="flex justify-between items-center mb-4">
										<div>
											<p className="text-2xl font-bold text-red-600">
												${parseFloat(formData.price || 0).toFixed(2)}
											</p>
											<p className="text-sm text-gray-600">
												{parseInt(formData.stock || 0)} in stock
											</p>
										</div>
									</div>
									<Button variant="danger" fullWidth size="sm">
										Add to Cart
									</Button>
								</div>
							</div>
						</Card>
					</div>

					{/* Right Column - Form */}
					<div className="lg:col-span-2">
						<Card>
							<form onSubmit={handleSubmit} className="p-6 space-y-6">
								{/* Product Name */}
								<div>
									<label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
										Product Name *
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="Enter product name"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										maxLength={100}
									/>
									<p className="text-xs text-gray-500 mt-1">{formData.name.length}/100</p>
								</div>

								{/* Description */}
								<div>
									<label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
										Description
									</label>
									<textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										placeholder="Enter product description (optional)"
										rows="4"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
										maxLength={500}
									/>
									<p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
								</div>

								{/* Price and Stock Row */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label htmlFor="price" className="block text-sm font-bold text-gray-900 mb-2">
											Price (USD) *
										</label>
										<div className="relative">
											<span className="absolute left-3 top-2 text-gray-500 font-bold">$</span>
											<input
												type="number"
												id="price"
												name="price"
												value={formData.price}
												onChange={handleChange}
												placeholder="0.00"
												step="0.01"
												min="0"
												className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
											/>
										</div>
									</div>

									<div>
										<label htmlFor="stock" className="block text-sm font-bold text-gray-900 mb-2">
											Stock Quantity *
										</label>
										<input
											type="number"
											id="stock"
											name="stock"
											value={formData.stock}
											onChange={handleChange}
											placeholder="0"
											min="0"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										/>
									</div>
								</div>

								{/* Category */}
								<div>
									<label htmlFor="category" className="block text-sm font-bold text-gray-900 mb-2">
										Category *
									</label>
									<select
										id="category"
										name="category"
										value={formData.category}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									>
										<option value="electronics">Electronics</option>
										<option value="accessories">Accessories</option>
										<option value="clothing">Clothing</option>
										<option value="home">Home & Garden</option>
										<option value="sports">Sports & Outdoors</option>
										<option value="other">Other</option>
									</select>
								</div>

								{/* Emoji/Icon Selector */}
								<div>
									<label className="block text-sm font-bold text-gray-900 mb-3">
										Product Icon
									</label>
									<div className="grid grid-cols-8 gap-2">
										{['🎧', '⌚', '📱', '💻', '🖥️', '⌨️', '🖱️', '🔌', '🔋', '📺', '❄️', '🛡️', '📷', '🎮', '📚', '👕'].map((emoji) => (
											<button
												key={emoji}
												type="button"
												onClick={() => handleAddImage(emoji)}
												className={`text-4xl p-2 rounded-lg border-2 transition ${
													formData.emoji === emoji
														? 'border-red-500 bg-red-50'
														: 'border-gray-300 hover:border-gray-400'
												}`}
											>
												{emoji}
											</button>
										))}
									</div>
								</div>

								{/* Submit Buttons */}
								<div className="flex gap-4 pt-6 border-t border-gray-200">
									<button
										type="button"
										onClick={() => navigate('/dashboard')}
										className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition flex items-center justify-center gap-2"
									>
										<Plus size={20} />
										Add Product
									</button>
								</div>
							</form>
						</Card>

						{/* Help Section */}
						<Card className="mt-6 bg-blue-50 border-blue-200">
							<div className="p-4">
								<h4 className="font-bold text-blue-900 mb-2">💡 Pro Tips</h4>
								<ul className="text-sm text-blue-800 space-y-1">
									<li>✓ Use clear, descriptive product names (max 100 characters)</li>
									<li>✓ Add detailed descriptions to help customers understand your product</li>
									<li>✓ Set competitive prices to attract customers</li>
									<li>✓ Choose the appropriate category for better visibility</li>
								</ul>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProductPage;
