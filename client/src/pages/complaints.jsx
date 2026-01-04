/**
 * Complaints Page - User complaint submission form
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, CheckCircle, AlertCircle, Clock, User, Mail } from 'lucide-react';
import Button from '../components/Button.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ComplaintsPage = () => {
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [user, setUser] = useState(null);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [myComplaints, setMyComplaints] = useState([]);
	const [showHistory, setShowHistory] = useState(false);
	const navigate = useNavigate();

	// Form state
	const [formData, setFormData] = useState({
		subject: '',
		category: 'general',
		priority: 'medium',
		message: ''
	});

	// Categories for complaints
	const categories = [
		{ value: 'general', label: 'General Inquiry' },
		{ value: 'order', label: 'Order Issue' },
		{ value: 'product', label: 'Product Quality' },
		{ value: 'delivery', label: 'Delivery Problem' },
		{ value: 'payment', label: 'Payment Issue' },
		{ value: 'refund', label: 'Refund Request' },
		{ value: 'account', label: 'Account Problem' },
		{ value: 'website', label: 'Website Bug' },
		{ value: 'suggestion', label: 'Suggestion' },
		{ value: 'other', label: 'Other' }
	];

	// Priority levels
	const priorities = [
		{ value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
		{ value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
		{ value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
		{ value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
	];

	useEffect(() => {
		const token = localStorage.getItem('authToken');
		const userData = localStorage.getItem('user');

		if (!token || !userData) {
			navigate('/login');
			return;
		}

		try {
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);
			fetchMyComplaints(token);
		} catch {
			navigate('/login');
		}
	}, [navigate]);

	const fetchMyComplaints = async (token) => {
		try {
			const response = await fetch(`${API_BASE_URL}/complaints/my-complaints`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setMyComplaints(data.data || []);
				}
			}
		} catch (err) {
			console.error('Error fetching complaints:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!formData.subject.trim() || !formData.message.trim()) {
			setError('Please fill in all required fields');
			return;
		}

		setSubmitting(true);

		try {
			const token = localStorage.getItem('authToken');
			const response = await fetch(`${API_BASE_URL}/complaints`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setSuccess('Your complaint has been submitted successfully! Our team will review it shortly.');
				setFormData({
					subject: '',
					category: 'general',
					priority: 'medium',
					message: ''
				});
				// Refresh complaints list
				fetchMyComplaints(token);
			} else {
				setError(data.message || 'Failed to submit complaint');
			}
		} catch (err) {
			console.error('Error submitting complaint:', err);
			setError('Network error. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
			'in-progress': { color: 'bg-blue-100 text-blue-800', icon: Clock },
			'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
			'closed': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
		};
		const config = statusConfig[status] || statusConfig['pending'];
		const Icon = config.icon;
		return (
			<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
				<Icon size={12} />
				{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
			</span>
		);
	};

	const getPriorityBadge = (priority) => {
		const priorityConfig = priorities.find(p => p.value === priority) || priorities[1];
		return (
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
				{priorityConfig.label}
			</span>
		);
	};

	if (loading) {
		return <LoadingScreen message="Loading Complaints" submessage="Please wait..." />;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-linear-to-r from-red-600 to-red-700 text-white shadow-lg">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link to="/dashboard" className="text-white hover:text-red-200 transition">
								<ArrowLeft size={24} />
							</Link>
							<div>
								<h1 className="text-2xl font-bold flex items-center gap-2">
									<MessageSquare size={28} />
									Submit a Complaint
								</h1>
								<p className="text-red-100 text-sm mt-1">We're here to help resolve your concerns</p>
							</div>
						</div>
						<button
							onClick={() => setShowHistory(!showHistory)}
							className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg text-sm font-medium transition"
						>
							{showHistory ? 'New Complaint' : 'View History'}
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Alerts */}
				{success && (
					<div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r flex items-center gap-2">
						<CheckCircle size={20} />
						{success}
					</div>
				)}
				{error && (
					<div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r flex items-center gap-2">
						<AlertCircle size={20} />
						{error}
					</div>
				)}

				{/* User Info Card */}
				<div className="bg-white rounded-lg shadow-md p-4 mb-6">
					<h3 className="text-sm font-medium text-gray-500 mb-2">Submitting as:</h3>
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
							<User size={24} className="text-red-600" />
						</div>
						<div>
							<p className="font-semibold text-gray-900">{user?.username}</p>
							<p className="text-sm text-gray-500 flex items-center gap-1">
								<Mail size={14} />
								{user?.email || `${user?.username}@example.com`}
							</p>
						</div>
					</div>
				</div>

				{!showHistory ? (
					/* Complaint Form */
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-6">New Complaint</h2>

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Subject */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Subject <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="subject"
									value={formData.subject}
									onChange={handleInputChange}
									placeholder="Brief description of your concern"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
									required
								/>
							</div>

							{/* Category and Priority Row */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Category */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Category
									</label>
									<select
										name="category"
										value={formData.category}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
									>
										{categories.map(cat => (
											<option key={cat.value} value={cat.value}>{cat.label}</option>
										))}
									</select>
								</div>

								{/* Priority */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Priority
									</label>
									<select
										name="priority"
										value={formData.priority}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
									>
										{priorities.map(pri => (
											<option key={pri.value} value={pri.value}>{pri.label}</option>
										))}
									</select>
								</div>
							</div>

							{/* Message */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Describe Your Concern <span className="text-red-500">*</span>
								</label>
								<textarea
									name="message"
									value={formData.message}
									onChange={handleInputChange}
									rows={6}
									placeholder="Please provide as much detail as possible about your concern..."
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
									required
								/>
								<p className="text-xs text-gray-500 mt-1">
									{formData.message.length}/1000 characters
								</p>
							</div>

							{/* Submit Button */}
							<div className="flex justify-end">
								<Button
									type="submit"
									variant="danger"
									disabled={submitting}
									className="flex items-center gap-2 px-6 py-3"
								>
									{submitting ? (
										<>
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											Submitting...
										</>
									) : (
										<>
											<Send size={18} />
											Submit Complaint
										</>
									)}
								</Button>
							</div>
						</form>
					</div>
				) : (
					/* Complaints History */
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-6">
							Your Complaints History
							<span className="ml-2 text-sm font-normal text-gray-500">
								({myComplaints.length} total)
							</span>
						</h2>

						{myComplaints.length === 0 ? (
							<div className="text-center py-12">
								<MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
								<p className="text-gray-500">You haven't submitted any complaints yet.</p>
							</div>
						) : (
							<div className="space-y-4">
								{myComplaints.map((complaint) => (
									<div
										key={complaint.id}
										className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
									>
										<div className="flex items-start justify-between mb-2">
											<h3 className="font-semibold text-gray-900">{complaint.subject}</h3>
											<div className="flex items-center gap-2">
												{getPriorityBadge(complaint.priority)}
												{getStatusBadge(complaint.status)}
											</div>
										</div>
										<p className="text-sm text-gray-600 mb-3 line-clamp-2">{complaint.message}</p>
										<div className="flex items-center justify-between text-xs text-gray-500">
											<span className="bg-gray-100 px-2 py-1 rounded">
												{categories.find(c => c.value === complaint.category)?.label || complaint.category}
											</span>
											<span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
										</div>
										{complaint.adminNotes && (
											<div className="mt-3 pt-3 border-t border-gray-200">
												<p className="text-xs font-medium text-gray-500">Admin Response:</p>
												<p className="text-sm text-gray-700">{complaint.adminNotes}</p>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ComplaintsPage;
