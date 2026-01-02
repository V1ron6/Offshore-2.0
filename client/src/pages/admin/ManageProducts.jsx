/**
 * Manage Products Page - Admin dashboard for product management
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Edit2, Trash2, Plus, LogOut, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ManageProducts = () => {
	const [loading, setLoading] = useState(false);
	const [admin, setAdmin] = useState(null);
	const [products, setProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const adminToken = localStorage.getItem('adminToken');
		const adminData = localStorage.getItem('adminData');

		if (!adminToken || !adminData) {
			navigate('/admin/login');
			return;
		}

		try {
			setAdmin(JSON.parse(adminData));
			setLoading(true);

			// Fetch products from backend
			const fetchProducts = async () => {
				try {
					const response = await fetch(`${API_BASE_URL}/products?limit=20`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log('Products data received:', data);
						if (data.success && data.data) {
							setProducts(data.data.slice(0, 20));
						}
					}
				} catch (err) {
					console.error('Error fetching products:', err);
					setError('Failed to load products');
				} finally {
					setLoading(false);
				}
			};

			fetchProducts();
		} catch (err) {
			navigate('/admin/login');
		}
	}, [navigate]);

	const handleLogout = () => {
		setSuccess('Logging out...');
		setTimeout(() => {
			localStorage.removeItem('adminToken');
			localStorage.removeItem('adminData');
			navigate('/admin/login');
		}, 1000);
	};

	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.category?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDeleteProduct = (productId) => {
		if (confirm('Are you sure you want to delete this product?')) {
			setProducts(products.filter(p => p.id !== productId));
			setSuccess('Product deleted successfully');
		}
	};

	const handleToggleFeatured = (productId) => {
		setProducts(products.map(p =>
			p.id === productId ? { ...p, featured: !p.featured } : p
		));
		setSuccess('Product updated');
	};

	if (loading) {
		return <LoadingScreen message="Loading Products" submessage="Preparing product management..." />;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Top Navigation */}
			<div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Manage Products</h1>
							<p className="text-green-100 text-sm">Total products: {products.length}</p>
						</div>
						<Button 
							variant="danger" 
							size="sm"
							onClick={handleLogout}
							className="flex items-center gap-2"
						>
							<LogOut size={18} />
							Logout
						</Button>
					</div>
				</div>
			</div>

			{/* Alerts */}
			{success && (
				<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4 flex items-center gap-2">
					<CheckCircle size={20} />
					{success}
				</div>
			)}
			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 flex items-center gap-2">
					<AlertCircle size={20} />
					{error}
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Search and Actions */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-3 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search products by name or category..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>
						<Button variant="danger" className="flex items-center gap-2">
							<Plus size={18} />
							Add New Product
						</Button>
					</div>
				</div>

				{/* Products Table */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50 border-b-2 border-gray-200">
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Product Name</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Category</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Price</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Stock</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Featured</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredProducts.map((product) => (
									<tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
										<td className="py-4 px-6 font-semibold text-gray-900">{product.name}</td>
										<td className="py-4 px-6 text-gray-700">{product.category || 'N/A'}</td>
										<td className="py-4 px-6 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
										<td className="py-4 px-6 text-gray-600">{product.stock || 0} units</td>
										<td className="py-4 px-6">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
												product.featured
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-gray-100 text-gray-800'
											}`}>
												{product.featured ? 'Yes' : 'No'}
											</span>
										</td>
										<td className="py-4 px-6">
											<div className="flex gap-2">
												<button
													onClick={() => setSelectedProduct(product)}
													className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition"
													title="Edit product"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleDeleteProduct(product.id)}
													className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
													title="Delete product"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{filteredProducts.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							<Package size={40} className="mx-auto mb-2 opacity-50" />
							<p>No products found matching your search</p>
						</div>
					)}
				</div>

				{/* Product Details Panel */}
				{selectedProduct && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
							<h3 className="text-2xl font-bold mb-4">Product Details</h3>
							<div className="space-y-4">
								<div>
									<label className="text-sm text-gray-600">Product Name</label>
									<p className="font-semibold text-gray-900">{selectedProduct.name}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Category</label>
									<p className="font-semibold text-gray-900">{selectedProduct.category || 'N/A'}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Price</label>
									<p className="font-semibold text-gray-900">${selectedProduct.price.toFixed(2)}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Stock</label>
									<p className="font-semibold text-gray-900">{selectedProduct.stock || 0} units</p>
								</div>
								<div className="flex gap-2 pt-4">
									<button
										onClick={() => handleToggleFeatured(selectedProduct.id)}
										className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition"
									>
										Toggle Featured
									</button>
									<button
										onClick={() => setSelectedProduct(null)}
										className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ManageProducts;
