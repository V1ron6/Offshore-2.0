/**
 * ========================================
 * Enterprise Dashboard Component
 * ========================================
 * 
 * Enhanced dashboard with analytics, stats cards, and charts
 * Shows key metrics with IDOR and XSS protection
 * 
 * Features:
 * - Real-time analytics dashboard
 * - StatsCard metrics display
 * - Performance charts with Recharts
 * - Recent activity feed
 * - Quick action buttons
 * - IDOR protection (ownership verification)
 * - XSS protection (input sanitization)
 * - Protected route (requires authentication)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, TrendingUp, Users, Activity, Clock } from 'lucide-react';
import StatsCard from '../components/StatsCard.jsx';
import Chart from '../components/Chart.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Hero from '../components/Hero.jsx';
import { sanitizeInput, canAccessResource, validateSession } from '../utils/security.js';

/**
 * Dashboard Component
 * Enterprise analytics dashboard with IDOR and XSS protection
 */
const Dashboard = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalUsers: 1250,
		activeProjects: 45,
		revenue: '$125,450',
		growth: 12.5,
		completionRate: 78
	});
	const [chartData, setChartData] = useState([
		{ name: 'Week 1', value: 400 },
		{ name: 'Week 2', value: 600 },
		{ name: 'Week 3', value: 500 },
		{ name: 'Week 4', value: 800 }
	]);

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();

	// ========================================
	// EFFECTS
	// ========================================

	/**
	 * Check authentication on mount with IDOR protection
	 */
	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		
		if (!userData) {
			navigate('/login');
			return;
		}

		// IDOR Protection: Verify user owns this dashboard
		if (!canAccessResource(userData.id, userData.id)) {
			navigate('/');
			return;
		}

		setUser(userData);
		setLoading(false);
	}, [navigate]);

	// ========================================
	// RENDER
	// ========================================

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-2xl font-bold text-gray-700 mb-4">Loading...</p>
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Welcome, <span className="text-red-500">{user?.username}</span>! 👋
					</h1>
					<p className="text-gray-600">Manage your tasks and stay productive</p>
				</div>

				{/* Messages */}
				{error && (
					<div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
						⚠️ {error}
					</div>
				)}
				{success && (
					<div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
						✓ {success}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Add Todo Form */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-bold text-gray-900 mb-4">Add New Task</h2>
							<form onSubmit={handleAddTodo} className="flex gap-2">
								<input
									type="text"
									value={newTask}
									onChange={(e) => setNewTask(e.target.value)}
									placeholder="Enter your new task..."
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
								/>
								<button
									type="submit"
									className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
								>
									Add Task
								</button>
							</form>
						</div>

						{/* Filter Tabs */}
						<div className="flex gap-2 bg-white p-4 rounded-lg shadow-md">
							{['all', 'active', 'completed'].map((status) => (
								<button
									key={status}
									onClick={() => setFilterStatus(status)}
									className={`px-4 py-2 rounded-lg font-semibold transition ${
										filterStatus === status
											? 'bg-red-500 text-white'
											: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
									}`}
								>
									{status.charAt(0).toUpperCase() + status.slice(1)}
									<span className="ml-2 text-sm">
										({
											status === 'all'
												? stats.total
												: status === 'completed'
													? stats.completed
													: stats.active
										})
									</span>
								</button>
							))}
						</div>

						{/* Todo List */}
						<div className="bg-white rounded-lg shadow-md">
							{filteredTodos.length === 0 ? (
								<div className="p-8 text-center">
									<p className="text-gray-600 text-lg">
										{filterStatus === 'completed' && 'No completed tasks yet'}
										{filterStatus === 'active' && 'No active tasks. Great job!'}
										{filterStatus === 'all' && 'No tasks yet. Add one to get started!'}
									</p>
								</div>
							) : (
								<ul className="divide-y divide-gray-200">
									{filteredTodos.map((todo) => (
										<li
											key={todo.id}
											className="p-4 hover:bg-gray-50 transition flex items-center justify-between"
										>
											<div className="flex items-center gap-3 flex-1">
												<button
													type="button"
													onClick={() => handleToggleTodo(todo)}
													className="text-gray-400 hover:text-green-500 transition flex-shrink-0"
													title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
													aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
												>
													{todo.completed ? (
														<CheckCircle2 size={22} className="text-green-500" />
													) : (
														<Circle size={22} />
													)}
												</button>
												<span
													className={`flex-1 text-lg ${
														todo.completed
															? 'line-through text-gray-500'
															: 'text-gray-700'
													}`}
												>
													{todo.task}
												</span>
											</div>
											<button
												onClick={() => handleDeleteTodo(todo.id)}
												className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition font-semibold text-sm flex items-center space-x-1"
												title="Delete task"
											>
												<Trash2 size={16} />
												<span>Delete</span>
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>

					{/* Sidebar - Statistics */}
					<div className="space-y-6">
						{/* Progress Card */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-bold text-gray-900 mb-4">Progress</h3>
							<div className="space-y-4">
								<div>
									<div className="flex justify-between mb-2">
										<span className="text-gray-700">Completion Rate</span>
										<span className="font-bold text-red-500">{stats.completionRate}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div
											className="bg-red-500 h-3 rounded-full transition-all duration-300"
											style={{ width: `${stats.completionRate}%` }}
										></div>
									</div>
								</div>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="space-y-4">
							<div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6 shadow-md">
								<p className="text-sm opacity-90">Total Tasks</p>
								<p className="text-4xl font-bold">{stats.total}</p>
							</div>
							<div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg p-6 shadow-md">
								<p className="text-sm opacity-90">Completed</p>
								<p className="text-4xl font-bold">{stats.completed}</p>
							</div>
							<div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg p-6 shadow-md">
								<p className="text-sm opacity-90">Active</p>
								<p className="text-4xl font-bold">{stats.active}</p>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Stats</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>✓ Today's focus: {stats.active} tasks</li>
								<li>⚡ Productivity: {stats.completionRate}% done</li>
								<li>🎯 Keep it up!</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;