/**
 * View Concerns Page - Admin dashboard for managing customer complaints
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
	MessageSquare, Search, Eye, Trash2, CheckCircle, AlertCircle, 
	ArrowLeft, Clock, Filter, RefreshCw, Mail, User, Calendar,
	XCircle, CheckCircle2, Bell
} from 'lucide-react';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ViewConcerns = () => {
	const [loading, setLoading] = useState(true);
	const [complaints, setComplaints] = useState([]);
	const [stats, setStats] = useState({
		total: 0,
		unread: 0,
		pending: 0,
		inProgress: 0,
		resolved: 0
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [filterPriority, setFilterPriority] = useState('all');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [adminNotes, setAdminNotes] = useState('');
	const [newStatus, setNewStatus] = useState('');
	const navigate = useNavigate();

	// Status options
	const statusOptions = [
		{ value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
		{ value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
		{ value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
		{ value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: XCircle }
	];

	// Priority options
	const priorityOptions = [
		{ value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
		{ value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
		{ value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
		{ value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' }
	];

	useEffect(() => {
		const adminToken = localStorage.getItem('adminToken');
		const adminData = localStorage.getItem('adminData');

		if (!adminToken || !adminData) {
			navigate('/admin/login');
			return;
		}

		fetchComplaints();
		fetchStats();
	}, [navigate]);

	const fetchComplaints = async () => {
		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/complaints/admin/all`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setComplaints(data.data || []);
				}
			}
		} catch (err) {
			console.error('Error fetching complaints:', err);
			setError('Failed to load complaints');
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/complaints/admin/stats`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setStats(data.stats);
				}
			}
		} catch (err) {
			console.error('Error fetching stats:', err);
		}
	};

	const handleViewComplaint = async (complaint) => {
		setSelectedComplaint(complaint);
		setAdminNotes(complaint.adminNotes || '');
		setNewStatus(complaint.status);

		// Mark as read
		if (!complaint.isRead) {
			try {
				const adminToken = localStorage.getItem('adminToken');
				await fetch(`${API_BASE_URL}/complaints/admin/${complaint.id}`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${adminToken}`,
						'Content-Type': 'application/json'
					}
				});
				// Update local state
				setComplaints(prev => prev.map(c => 
					c.id === complaint.id ? { ...c, isRead: true } : c
				));
				setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
			} catch (err) {
				console.error('Error marking as read:', err);
			}
		}
	};

	const handleUpdateComplaint = async () => {
		if (!selectedComplaint) return;

		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/complaints/admin/${selectedComplaint.id}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					status: newStatus,
					adminNotes: adminNotes
				})
			});

			if (response.ok) {
				setSuccess('Complaint updated successfully');
				setComplaints(prev => prev.map(c => 
					c.id === selectedComplaint.id 
						? { ...c, status: newStatus, adminNotes: adminNotes }
						: c
				));
				setSelectedComplaint(null);
				fetchStats();
				setTimeout(() => setSuccess(''), 3000);
			} else {
				setError('Failed to update complaint');
			}
		} catch (err) {
			console.error('Error updating complaint:', err);
			setError('Failed to update complaint');
		}
	};

	const handleDeleteComplaint = async (complaintId) => {
		if (!confirm('Are you sure you want to delete this complaint?')) return;

		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/complaints/admin/${complaintId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				setSuccess('Complaint deleted successfully');
				setComplaints(prev => prev.filter(c => c.id !== complaintId));
				fetchStats();
				setTimeout(() => setSuccess(''), 3000);
			} else {
				setError('Failed to delete complaint');
			}
		} catch (err) {
			console.error('Error deleting complaint:', err);
			setError('Failed to delete complaint');
		}
	};

	const handleMarkAllRead = async () => {
		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/complaints/admin/mark-all-read`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				setSuccess('All complaints marked as read');
				setComplaints(prev => prev.map(c => ({ ...c, isRead: true })));
				setStats(prev => ({ ...prev, unread: 0 }));
				setTimeout(() => setSuccess(''), 3000);
			}
		} catch (err) {
			console.error('Error marking all as read:', err);
		}
	};

	const filteredComplaints = complaints.filter(complaint => {
		const matchesSearch = 
			complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			complaint.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			complaint.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			complaint.message?.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
		const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
		
		return matchesSearch && matchesStatus && matchesPriority;
	});

	const getStatusBadge = (status) => {
		const statusConfig = statusOptions.find(s => s.value === status) || statusOptions[0];
		const Icon = statusConfig.icon;
		return (
			<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
				<Icon size={12} />
				{statusConfig.label}
			</span>
		);
	};

	const getPriorityBadge = (priority) => {
		const priorityConfig = priorityOptions.find(p => p.value === priority) || priorityOptions[2];
		return (
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
				{priorityConfig.label}
			</span>
		);
	};

	if (loading) {
		return <LoadingScreen message="Loading Concerns" submessage="Fetching customer complaints..." />;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<div className="bg-linear-to-r from-red-600 to-red-700 text-white shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link to="/admin/dashboard" className="text-white hover:text-red-200 transition">
								<ArrowLeft size={24} />
							</Link>
							<div>
								<h1 className="text-2xl font-bold flex items-center gap-2">
									<MessageSquare size={28} />
									Customer Concerns
								</h1>
								<p className="text-red-100 text-sm mt-1">Manage and respond to customer complaints</p>
							</div>
						</div>
						{stats.unread > 0 && (
							<button
								onClick={handleMarkAllRead}
								className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg text-sm font-medium transition flex items-center gap-2"
							>
								<CheckCircle size={16} />
								Mark All Read
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
					<div className="bg-white rounded-lg shadow p-4">
						<p className="text-sm text-gray-500">Total</p>
						<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
						<p className="text-sm text-gray-500">Unread</p>
						<p className="text-2xl font-bold text-red-600">{stats.unread}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
						<p className="text-sm text-gray-500">Pending</p>
						<p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
						<p className="text-sm text-gray-500">In Progress</p>
						<p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
						<p className="text-sm text-gray-500">Resolved</p>
						<p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="bg-white rounded-lg shadow p-4 mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search complaints..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
							/>
						</div>
						<div className="flex gap-2">
							<select
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
							>
								<option value="all">All Status</option>
								{statusOptions.map(status => (
									<option key={status.value} value={status.value}>{status.label}</option>
								))}
							</select>
							<select
								value={filterPriority}
								onChange={(e) => setFilterPriority(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
							>
								<option value="all">All Priority</option>
								{priorityOptions.map(priority => (
									<option key={priority.value} value={priority.value}>{priority.label}</option>
								))}
							</select>
							<button
								onClick={() => { fetchComplaints(); fetchStats(); }}
								className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
							>
								<RefreshCw size={20} />
							</button>
						</div>
					</div>
				</div>

				{/* Complaints List */}
				<div className="bg-white rounded-lg shadow overflow-hidden">
					{filteredComplaints.length === 0 ? (
						<div className="text-center py-12">
							<MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
							<p className="text-gray-500">No complaints found</p>
						</div>
					) : (
						<div className="divide-y divide-gray-200">
							{filteredComplaints.map((complaint) => (
								<div
									key={complaint.id}
									className={`p-4 hover:bg-gray-50 transition cursor-pointer ${!complaint.isRead ? 'bg-red-50' : ''}`}
									onClick={() => handleViewComplaint(complaint)}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												{!complaint.isRead && (
													<span className="w-2 h-2 bg-red-500 rounded-full"></span>
												)}
												<h3 className="font-semibold text-gray-900">{complaint.subject}</h3>
											</div>
											<p className="text-sm text-gray-600 line-clamp-1 mb-2">{complaint.message}</p>
											<div className="flex items-center gap-4 text-xs text-gray-500">
												<span className="flex items-center gap-1">
													<User size={12} />
													{complaint.username}
												</span>
												<span className="flex items-center gap-1">
													<Mail size={12} />
													{complaint.userEmail}
												</span>
												<span className="flex items-center gap-1">
													<Calendar size={12} />
													{new Date(complaint.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2 ml-4">
											<div className="flex items-center gap-2">
												{getPriorityBadge(complaint.priority)}
												{getStatusBadge(complaint.status)}
											</div>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteComplaint(complaint.id);
												}}
												className="text-red-500 hover:text-red-700 p-1"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Complaint Detail Modal */}
			{selectedComplaint && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<h2 className="text-xl font-bold text-gray-900">{selectedComplaint.subject}</h2>
								<button
									onClick={() => setSelectedComplaint(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									<XCircle size={24} />
								</button>
							</div>

							{/* Customer Info */}
							<div className="bg-gray-50 rounded-lg p-4 mb-4">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
										<User size={24} className="text-red-600" />
									</div>
									<div>
										<p className="font-semibold text-gray-900">{selectedComplaint.username}</p>
										<p className="text-sm text-gray-500">{selectedComplaint.userEmail}</p>
									</div>
								</div>
							</div>

							{/* Complaint Details */}
							<div className="mb-4">
								<div className="flex items-center gap-2 mb-2">
									{getPriorityBadge(selectedComplaint.priority)}
									{getStatusBadge(selectedComplaint.status)}
									<span className="text-xs text-gray-500">
										Category: {selectedComplaint.category}
									</span>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}
								</p>
							</div>

							{/* Message */}
							<div className="bg-gray-50 rounded-lg p-4 mb-6">
								<h3 className="font-medium text-gray-700 mb-2">Customer Message:</h3>
								<p className="text-gray-600 whitespace-pre-wrap">{selectedComplaint.message}</p>
							</div>

							{/* Admin Actions */}
							<div className="border-t pt-4">
								<h3 className="font-medium text-gray-700 mb-3">Admin Response</h3>
								
								{/* Status Update */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-600 mb-1">Update Status</label>
									<select
										value={newStatus}
										onChange={(e) => setNewStatus(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
									>
										{statusOptions.map(status => (
											<option key={status.value} value={status.value}>{status.label}</option>
										))}
									</select>
								</div>

								{/* Admin Notes */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-600 mb-1">Admin Notes / Response</label>
									<textarea
										value={adminNotes}
										onChange={(e) => setAdminNotes(e.target.value)}
										rows={4}
										placeholder="Add notes or response for this complaint..."
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
									/>
								</div>

								{/* Actions */}
								<div className="flex justify-end gap-3">
									<Button
										variant="secondary"
										onClick={() => setSelectedComplaint(null)}
									>
										Cancel
									</Button>
									<Button
										variant="danger"
										onClick={handleUpdateComplaint}
									>
										Update Complaint
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewConcerns;
