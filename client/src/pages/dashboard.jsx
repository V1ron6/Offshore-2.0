/**
 * ========================================
 * Dashboard Component
 * ========================================
 * 
 * Main dashboard page showing user's todos and productivity stats.
 * Displays all, completed, and active todos with filtering capabilities.
 * 
 * Features:
 * - Todo list management
 * - Task status filtering (All, Active, Completed)
 * - Add new todo functionality
 * - Statistics and progress tracking
 * - Delete/mark complete operations
 * - Protected route (requires authentication)
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Dashboard Component
 * Protected page showing user's todo management interface
 */
const Dashboard = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [filterStatus, setFilterStatus] = useState('all'); // all, completed, active
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user') || 'null');

	// ========================================
	// EFFECTS
	// ========================================

	/**
	 * Check authentication on mount
	 * Redirect to login if user is not authenticated
	 */
	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	/**
	 * Fetch todos on component mount
	 */
	useEffect(() => {
		fetchTodos();
	}, []);

	/**
	 * Auto-clear messages after 5 seconds
	 */
	useEffect(() => {
		if (error || success) {
			const timer = setTimeout(() => {
				setError("");
				setSuccess("");
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error, success]);

	// ========================================
	// API FUNCTIONS
	// ========================================

	/**
	 * Fetch all todos from backend
	 */
	const fetchTodos = async () => {
		try {
			setLoading(true);
			const response = await axios.get('http://localhost:3000/api/todo');
			setTodos(response.data.todo || []);
		} catch (err) {
			console.error("Error fetching todos:", err);
			setError("Failed to load todos");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Add new todo to the list
	 */
	const handleAddTodo = async (e) => {
		e.preventDefault();

		if (!newTask.trim()) {
			setError("Please enter a task");
			return;
		}

		try {
			const response = await axios.post('http://localhost:3000/api/todo', {
				task: newTask.trim(),
				completed: false
			});

			setTodos([...todos, response.data]);
			setNewTask("");
			setSuccess("Task added successfully!");
		} catch (err) {
			console.error("Error adding todo:", err);
			setError(err.response?.data?.error || "Failed to add task");
		}
	};

	/**
	 * Toggle todo completion status
	 * @param {object} todo - Todo item to toggle
	 */
	const handleToggleTodo = (todo) => {
		const updatedTodos = todos.map((t) =>
			t.id === todo.id ? { ...t, completed: !t.completed } : t
		);
		setTodos(updatedTodos);
		setSuccess(`Task marked as ${!todo.completed ? 'completed' : 'active'}`);
	};

	/**
	 * Delete a todo
	 * @param {number} id - Todo id to delete
	 */
	const handleDeleteTodo = (id) => {
		setTodos(todos.filter((t) => t.id !== id));
		setSuccess("Task deleted successfully!");
	};

	// ========================================
	// DERIVED STATE
	// ========================================

	/**
	 * Get filtered todos based on current filter status
	 */
	const filteredTodos = todos.filter((todo) => {
		if (filterStatus === 'completed') return todo.completed;
		if (filterStatus === 'active') return !todo.completed;
		return true;
	});

	/**
	 * Calculate statistics
	 */
	const stats = {
		total: todos.length,
		completed: todos.filter((t) => t.completed).length,
		active: todos.filter((t) => !t.completed).length,
		completionRate: todos.length > 0 ? Math.round((todos.filter((t) => t.completed).length / todos.length) * 100) : 0
	};

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