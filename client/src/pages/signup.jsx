/**
 * ========================================
 * Signup Page Component
 * ========================================
 * 
 * User registration form with validation.
 * Allows new users to create an account.
 * 
 * Features:
 * - Form validation
 * - Password confirmation
 * - Error handling
 * - Success messaging
 * - Redirect on successful signup
 * - Link to login page
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingScreen  from '../components/LoadingScreen.jsx'
// Validation rules for signup form
const VALIDATION_RULES = {
	username: {
		minLength: 3,
		maxLength: 20,
		pattern: /^[a-zA-Z0-9_-]+$/,
		patternError: "Username can only contain letters, numbers, underscore, and dash"
	},
	email: {
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		patternError: "Please enter a valid email address"
	},
	password: {
		minLength: 6,
		maxLength: 50,
		pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
		patternError: "Password must contain uppercase, lowercase, and numbers"
	}
};

/**
 * Signup Component
 * Registration form for new users
 */
const Signup = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [fieldErrors, setFieldErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();

	// ========================================
	// EFFECTS
	// ========================================

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
	// VALIDATION FUNCTIONS
	// ========================================

	/**
	 * Validate username field
	 */
	const validateUsername = (username) => {
		if (!username.trim()) {
			return "Username is required";
		}
		if (username.trim().length < VALIDATION_RULES.username.minLength) {
			return `Username must be at least ${VALIDATION_RULES.username.minLength} characters`;
		}
		if (username.trim().length > VALIDATION_RULES.username.maxLength) {
			return `Username cannot exceed ${VALIDATION_RULES.username.maxLength} characters`;
		}
		if (!VALIDATION_RULES.username.pattern.test(username.trim())) {
			return VALIDATION_RULES.username.patternError;
		}
		return "";
	};

	/**
	 * Validate email field
	 */
	const validateEmail = (email) => {
		if (!email.trim()) {
			return "Email is required";
		}
		if (!VALIDATION_RULES.email.pattern.test(email.trim())) {
			return VALIDATION_RULES.email.patternError;
		}
		return "";
	};

	/**
	 * Validate password field
	 */
	const validatePassword = (password) => {
		if (!password) {
			return "Password is required";
		}
		if (password.length < VALIDATION_RULES.password.minLength) {
			return `Password must be at least ${VALIDATION_RULES.password.minLength} characters`;
		}
		return "";
	};

	/**
	 * Validate password confirmation
	 */
	const validateConfirmPassword = (password, confirmPassword) => {
		if (!confirmPassword) {
			return "Please confirm your password";
		}
		if (password !== confirmPassword) {
			return "Passwords do not match";
		}
		return "";
	};

	/**
	 * Validate entire form
	 */
	const validateForm = () => {
		const errors = {};

		const usernameError = validateUsername(formData.username);
		if (usernameError) errors.username = usernameError;

		const emailError = validateEmail(formData.email);
		if (emailError) errors.email = emailError;

		const passwordError = validatePassword(formData.password);
		if (passwordError) errors.password = passwordError;

		const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
		if (confirmError) errors.confirmPassword = confirmError;

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	};

	// ========================================
	// EVENT HANDLERS
	// ========================================

	/**
	 * Handle form input changes
	 */
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Clear field error on input
		if (fieldErrors[name]) {
			setFieldErrors({ ...fieldErrors, [name]: "" });
		}
	};

	/**
	 * Handle form submission
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");
		setSuccess("");
		setFieldErrors({});

		// Validate form
		const validation = validateForm();
		if (!validation.isValid) {
			setFieldErrors(validation.errors);
			setError("Please fix the errors above");
			return;
		}

		try {
			setLoading(true);

			// In a real app, this would create a new user in the backend
			// For now, we'll just add them to the user list
			const newUser = {
				id: Math.random(),
				username: formData.username.trim(),
				email: formData.email.trim(),
				password: formData.password
			};

		setSuccess("Account created successfully! Redirecting to dashboard...");
		localStorage.setItem('user', JSON.stringify({
			username: newUser.username,
			email: newUser.email,
			signupTime: new Date().toISOString()
		}));

		setTimeout(() => {
			navigate('/app');
			}, 1500);
		} catch (err) {
			console.error("Signup error:", err);
			setError(err.response?.data?.message || "Signup failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// ========================================
	// RENDER
	// ========================================

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-6 sm:mb-8">
					<h1 className="text-4xl sm:text-5xl font-bold">
						Off<span className="text-red-300">Shore</span>
					</h1>
					<p className="text-gray-600 mt-2 text-sm sm:text-base">Create your account to get started</p>
				</div>

				{/* Signup Form */}
				<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8" noValidate>
					{/* Navigation Tabs */}
					<div className="rounded-md flex justify-center gap-2 sm:gap-4 w-full shadow-sm z-100 mb-4 sm:mb-6">
						<Link to={"/signup"} className="flex-1 sm:flex-none">
							<button 
								className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-black bg-blue-50 rounded-md hover:bg-gray-100 transition duration-200 font-medium text-sm sm:text-base"
								title="you are on this page"
								disabled
							>
								Signup
							</button>
						</Link>
						<Link to={"/login"} className="flex-1 sm:flex-none">
							<button 
								className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-black logoColor rounded-md hover:bg-gray-100 transition duration-200 font-medium"
								title="Go To Login page"
							>
								Login
							</button>
						</Link>
					</div>
					
					{/* Alert Messages */}
					{error && (
					<div className="mb-4 p-3 sm:p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm sm:text-base" role="alert">
						<div className="flex items-start sm:items-center gap-2">
							<AlertCircle size={20} className="mt-0.5 sm:mt-0 shrink-0" />
							<span>{error}</span>
						</div>
					</div>
				)}

				{success && (
					<div className="mb-4 p-3 sm:p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded text-sm sm:text-base" role="alert">
						<div className="flex items-start sm:items-center gap-2">
							<CheckCircle size={20} className="mt-0.5 sm:mt-0 shrink-0" />
							<span>{success}</span>
						</div>
					</div>
				)}

				{/* Username Field */}
				<div className="mb-5">
					<label htmlFor="username" className="block font-semibold text-gray-700 mb-2">
						Username <span className="text-red-500">*</span>
					</label>
					<input
						id="username"
						type="text"
						name="username"
						value={formData.username}
						onChange={handleInputChange}
						placeholder="Choose a username"
						className={`
							w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
							${fieldErrors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'}
							${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
						`}
						disabled={loading}
						required
					/>
					{fieldErrors.username && (
						<p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
					)}
					</div>

					{/* Email Field */}
					<div className="mb-5">
						<label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
							Email <span className="text-red-500">*</span>
						</label>
						<input
							id="email"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="your@email.com"
							className={`
								w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
								${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}
								${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
							`}
							disabled={loading}
							required
						/>
						{fieldErrors.email && (
							<p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
						)}
					</div>

					{/* Password Field */}
					<div className="mb-5">
						<label htmlFor="password" className="block font-semibold text-gray-700 mb-2">
							Password <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Create a strong password"
								className={`
									w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
									${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}
									${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
								`}
								disabled={loading}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
								disabled={loading}
								title={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						{fieldErrors.password && (
							<p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
						)}
						<p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
					</div>

					{/* Confirm Password Field */}
					<div className="mb-6">
						<label htmlFor="confirmPassword" className="block font-semibold text-gray-700 mb-2">
							Confirm Password <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								placeholder="Confirm your password"
								className={`
									w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
									${fieldErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}
									${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
								`}
								disabled={loading}
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
								disabled={loading}
								title={showConfirmPassword ? "Hide password" : "Show password"}
							>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						{fieldErrors.confirmPassword && (
							<p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
						)}
					</div>
        {/* have been left here intentionally */}
				{/* Demo Credentials Hint 
				<div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
					<p className="text-sm font-semibold text-blue-900 mb-2">Try Demo Login:</p>
					<p className="text-sm text-blue-800"><strong>Username:</strong> user123</p>
					<p className="text-sm text-blue-800"><strong>Password:</strong> passw0rd123</p>
				</div>
				*/}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={loading}
					className={`
						w-full py-3 px-4 sm:py-2.5 sm:px-3 bg-red-500 text-white font-semibold rounded-lg transition
						${loading 
							? 'opacity-70 cursor-not-allowed bg-gray-400' 
							: 'hover:bg-red-600 active:scale-95'
						}
					`}
				>
					{loading ? "Creating account..." : "Sign Up"}
				</button>

					{/* Login Link */}
					<p className="text-center mt-6 text-gray-600">
						Already have an account?{" "}
						<Link to="/login" className="text-red-500 font-semibold hover:underline">
							Sign In
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Signup;