import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const AdminLogin = () => {
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"
	// Check if already logged in as admin
	useEffect(() => {
		const adminToken = localStorage.getItem('adminToken');
		if (adminToken) {
			navigate('/admin/dashboard');
		}
	}, [navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!username || !password) {
			setError('Please fill in all fields');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${apiURL}/admin/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (data.success) {
				setSuccess('✓ Login successful! Redirecting...');
				localStorage.setItem('adminToken', data.token);
				localStorage.setItem('adminData', JSON.stringify(data.admin));
				
				setTimeout(() => {
					navigate('/admin/dashboard');
				}, 1500);
			} else {
				setError('⚠️ ' + (data.message || 'Login failed'));
			}
		} catch (err) {
			setError('⚠️ Network error. Please try again.');
			console.error('Login error:', err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <LoadingScreen message="Verifying Credentials" submessage="Logging in to admin dashboard..." />;
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-red-600 to-red-700 flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				{/* Card Container */}
				<div className="bg-white rounded-lg shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-8 text-white text-center">
						<div className="flex items-center justify-center gap-2 mb-2">
							<Lock size={28} />
							<h1 className="text-3xl font-bold">Admin Portal</h1>
						</div>
						<p className="text-red-100 text-sm">🌊 Offshore Administration</p>
					</div>

					{/* Form Container */}
					<div className="px-6 py-8">
						{/* Error Alert */}
						{error && (
							<div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
								<AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
								<p className="text-red-700 text-sm font-medium">{error}</p>
							</div>
						)}

						{/* Success Alert */}
						{success && (
							<div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg flex items-start gap-3">
								<CheckCircle className="text-green-600 mt-0.5 shrink-0" size={20} />
								<p className="text-green-700 text-sm font-medium">{success}</p>
							</div>
						)}

						{/* Login Form */}
						<form onSubmit={handleLogin} className="space-y-5">
							{/* Username Field */}
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Username</label>
								<div className="relative">
									<User className="absolute left-3 top-3 text-gray-400" size={20} />
									<input
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Enter your username"
										className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition text-gray-900 placeholder-gray-400"
									/>
								</div>
							</div>

							{/* Password Field */}
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Password</label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 text-gray-400" size={20} />
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition text-gray-900 placeholder-gray-400"
									/>
								</div>
							</div>

							{/* Submit Button */}
							<Button 
								variant="danger" 
								fullWidth
								className="mt-6 font-semibold py-3"
								onClick={handleLogin}
							>
								Login to Dashboard
							</Button>
						</form>

						{/* Demo Credentials */}
						<div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
							<p className="text-blue-900 font-semibold text-sm mb-2">📌 Demo Credentials:</p>
							<p className="text-blue-800 text-xs mb-1"><strong>Admin 1:</strong> admin1 / Admin@123</p>
							<p className="text-blue-800 text-xs"><strong>Admin 2:</strong> admin2 / Admin@456</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6 text-white">
					<p className="text-sm">🔐 Secure Admin Access Only</p>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
