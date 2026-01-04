/**
 * Add Product Page - Dedicated form for adding new products
 * Features: Image upload (min 3, max 5MB each)
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X, Image, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_IMAGES = 3;
const MAX_IMAGES = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const AddProductPage = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [images, setImages] = useState([]); // Array of { file, preview, name }
	const [imageErrors, setImageErrors] = useState([]);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		stock: '',
		category: 'electronics'
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

	// Cleanup preview URLs on unmount
	useEffect(() => {
		return () => {
			images.forEach(img => {
				if (img.preview) URL.revokeObjectURL(img.preview);
			});
		};
	}, [images]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const validateImage = (file) => {
		const errors = [];
		
		if (!ALLOWED_TYPES.includes(file.type)) {
			errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.`);
		}
		
		if (file.size > MAX_FILE_SIZE) {
			errors.push(`${file.name}: File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`);
		}
		
		return errors;
	};

	const handleImageSelect = (e) => {
		const files = Array.from(e.target.files);
		const newErrors = [];
		const validImages = [];

		// Check if adding these would exceed max
		if (images.length + files.length > MAX_IMAGES) {
			setError(`You can only upload up to ${MAX_IMAGES} images. You have ${images.length} images.`);
			return;
		}

		files.forEach(file => {
			const fileErrors = validateImage(file);
			if (fileErrors.length > 0) {
				newErrors.push(...fileErrors);
			} else {
				validImages.push({
					file,
					preview: URL.createObjectURL(file),
					name: file.name
				});
			}
		});

		if (newErrors.length > 0) {
			setImageErrors(newErrors);
			setTimeout(() => setImageErrors([]), 5000);
		}

		if (validImages.length > 0) {
			setImages(prev => [...prev, ...validImages]);
			setError('');
		}

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleRemoveImage = (index) => {
		setImages(prev => {
			const newImages = [...prev];
			// Revoke the URL to free memory
			if (newImages[index].preview) {
				URL.revokeObjectURL(newImages[index].preview);
			}
			newImages.splice(index, 1);
			return newImages;
		});
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		const files = Array.from(e.dataTransfer.files).filter(file => 
			file.type.startsWith('image/')
		);
		
		if (files.length > 0) {
			const event = { target: { files } };
			handleImageSelect(event);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		// Validate form
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

		// Validate minimum images
		if (images.length < MIN_IMAGES) {
			setError(`Please upload at least ${MIN_IMAGES} images. You have ${images.length}.`);
			return;
		}

		setSubmitting(true);

		try {
			// Create FormData for multipart upload
			const submitData = new FormData();
			submitData.append('name', formData.name);
			submitData.append('description', formData.description);
			submitData.append('price', formData.price);
			submitData.append('stock', formData.stock);
			submitData.append('category', formData.category);
			submitData.append('userId', user.id);

			// Append all images
			images.forEach((img) => {
				submitData.append('images', img.file);
			});

			const token = localStorage.getItem('authToken');
			const response = await fetch(`${API_URL}/products`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: submitData
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setSuccess(`✓ Product "${formData.name}" has been added successfully!`);
				
				// Cleanup
				images.forEach(img => {
					if (img.preview) URL.revokeObjectURL(img.preview);
				});

				// Reset form
				setFormData({
					name: '',
					description: '',
					price: '',
					stock: '',
					category: 'electronics'
				});
				setImages([]);

				// Redirect after success
				setTimeout(() => {
					navigate('/dashboard');
				}, 2000);
			} else {
				setError(data.message || 'Failed to add product. Please try again.');
			}
		} catch (err) {
			console.error('Error adding product:', err);
			setError('Failed to add product. Please check your connection and try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleAddImage = () => {}; // Kept for compatibility

	if (loading) {
		return <LoadingScreen message="Loading Add Product" submessage="Preparing the form..." />;
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
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
						<div className="flex items-center gap-2">
							<AlertCircle size={20} />
							<span>{error}</span>
						</div>
						<button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
							<X size={20} />
						</button>
					</div>
				)}

				{imageErrors.length > 0 && (
					<div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<AlertCircle size={20} />
							<span className="font-bold">Image Upload Errors:</span>
						</div>
						<ul className="list-disc list-inside text-sm">
							{imageErrors.map((err, idx) => (
								<li key={idx}>{err}</li>
							))}
						</ul>
					</div>
				)}

				{success && (
					<div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg flex items-center gap-2">
						<CheckCircle size={20} />
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
									<div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
										{images.length > 0 ? (
											<img 
												src={images[0].preview} 
												alt="Product preview" 
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="text-gray-400 flex flex-col items-center">
												<Image size={48} />
												<span className="text-sm mt-2">No image</span>
											</div>
										)}
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

								{/* Image count indicator */}
								<div className="mt-4 p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600">Images uploaded:</span>
										<span className={`font-bold ${images.length >= MIN_IMAGES ? 'text-green-600' : 'text-red-600'}`}>
											{images.length} / {MIN_IMAGES} min
										</span>
									</div>
									<div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
										<div 
											className={`h-full transition-all ${images.length >= MIN_IMAGES ? 'bg-green-500' : 'bg-red-500'}`}
											style={{ width: `${Math.min((images.length / MIN_IMAGES) * 100, 100)}%` }}
										/>
									</div>
								</div>
							</div>
						</Card>
					</div>

					{/* Right Column - Form */}
					<div className="lg:col-span-2">
						<Card>
							<form onSubmit={handleSubmit} className="p-6 space-y-6">
								{/* Image Upload Section */}
								<div>
									<label className="block text-sm font-bold text-gray-900 mb-3">
										Product Images * <span className="font-normal text-gray-500">(Minimum {MIN_IMAGES}, Max 5MB each)</span>
									</label>
									
									{/* Drop Zone */}
									<div
										onDragOver={handleDragOver}
										onDrop={handleDrop}
										onClick={() => fileInputRef.current?.click()}
										className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition"
									>
										<Upload size={48} className="mx-auto text-gray-400 mb-4" />
										<p className="text-gray-600 mb-2">
											<span className="font-semibold text-red-500">Click to upload</span> or drag and drop
										</p>
										<p className="text-sm text-gray-500">
											JPEG, PNG, WebP or GIF (Max 5MB each)
										</p>
									</div>
									
									<input
										ref={fileInputRef}
										type="file"
										accept="image/jpeg,image/png,image/webp,image/gif"
										multiple
										onChange={handleImageSelect}
										className="hidden"
									/>

									{/* Image Previews */}
									{images.length > 0 && (
										<div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
											{images.map((img, index) => (
												<div key={index} className="relative group">
													<div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
														<img
															src={img.preview}
															alt={`Preview ${index + 1}`}
															className="w-full h-full object-cover"
														/>
													</div>
													{index === 0 && (
														<span className="absolute top-1 left-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
															Main
														</span>
													)}
													<button
														type="button"
														onClick={() => handleRemoveImage(index)}
														className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
													>
														<X size={14} />
													</button>
													<p className="text-xs text-gray-500 mt-1 truncate">{img.name}</p>
												</div>
											))}
											
											{/* Add More Button */}
											{images.length < MAX_IMAGES && (
												<button
													type="button"
													onClick={() => fileInputRef.current?.click()}
													className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition"
												>
													<Plus size={24} />
													<span className="text-xs mt-1">Add</span>
												</button>
											)}
										</div>
									)}
								</div>

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
										disabled={submitting}
										className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={submitting || images.length < MIN_IMAGES}
										className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{submitting ? (
											<>
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												Uploading...
											</>
										) : (
											<>
												<Plus size={20} />
												Add Product
											</>
										)}
									</button>
								</div>
							</form>
						</Card>

						{/* Help Section */}
						<Card className="mt-6 bg-blue-50 border-blue-200">
							<div className="p-4">
								<h4 className="font-bold text-blue-900 mb-2">💡 Pro Tips</h4>
								<ul className="text-sm text-blue-800 space-y-1">
									<li>✓ Upload at least {MIN_IMAGES} high-quality product images</li>
									<li>✓ First image will be the main product thumbnail</li>
									<li>✓ Use clear, well-lit photos from multiple angles</li>
									<li>✓ Keep each image under 5MB for faster uploads</li>
									<li>✓ Use clear, descriptive product names</li>
									<li>✓ Set competitive prices to attract customers</li>
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
