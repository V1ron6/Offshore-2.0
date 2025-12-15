import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Offshorelogo from '../assets/Offshorelogo.jpg'

// ========================================
// CONSTANTS - Styling and Configuration
// ========================================
const button = "m-1 w-30 border border-black p-1 logoColor rounded-md";
const buttonCenter = button + " w-60";

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const LOGIN_TIMEOUT = 10000; // 10 seconds timeout for API calls

// Validation rules
const VALIDATION_RULES = {
	username: {
		minLength: 3,
		maxLength: 20,
		pattern: /^[a-zA-Z0-9_-]+$/,
		patternError: "Username can only contain letters, numbers, underscore, and dash"
	},
	password: {
		minLength: 3,
		maxLength: 50
	}
};

/**
 * Login Component
 * Handles user authentication with form validation, error handling, and UI state management
 * Features:
 * - Form validation with detailed error messages
 * - Loading states and disabled inputs during submission
 * - Password visibility toggle
 * - Remember me functionality with localStorage
 * - Success/error notifications
 * - Auto-redirect on successful login
 * - Accessibility features (focus management, ARIA labels)
 */
const Login = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	
	// Form state
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	// UI state
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [fieldErrors, setFieldErrors] = useState({});

	// Navigation
	const navigate = useNavigate();

	// ========================================
	// EFFECTS
	// ========================================

	/**
	 * Load saved credentials on component mount
	 * Checks localStorage for previously saved username/password
	 */
	useEffect(() => {
		const savedCredentials = localStorage.getItem('rememberMe');
		if (savedCredentials) {
			try {
				const { username: savedUsername, password: savedPassword } = JSON.parse(savedCredentials);
				setUsername(savedUsername || "");
				setPassword(savedPassword || "");
				setRememberMe(true);
			} catch (err) {
				console.error("Error loading saved credentials:", err);
				localStorage.removeItem('rememberMe');
			}
		}
	}, []);

	/**
	 * Clear error/success messages after 5 seconds
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
	 * Checks: required, length, allowed characters
	 * @param {string} value - Username to validate
	 * @returns {object} - { isValid: boolean, error: string }
	 */
	const validateUsername = (value) => {
		if (!value || !value.trim()) {
			return { isValid: false, error: "Username is required" };
		}

		const trimmed = value.trim();

		if (trimmed.length < VALIDATION_RULES.username.minLength) {
			return {
				isValid: false,
				error: `Username must be at least ${VALIDATION_RULES.username.minLength} characters`
			};
		}

		if (trimmed.length > VALIDATION_RULES.username.maxLength) {
			return {
				isValid: false,
				error: `Username cannot exceed ${VALIDATION_RULES.username.maxLength} characters`
			};
		}

		if (!VALIDATION_RULES.username.pattern.test(trimmed)) {
			return {
				isValid: false,
				error: VALIDATION_RULES.username.patternError
			};
		}

		return { isValid: true, error: "" };
	};

	/**
	 * Validate password field
	 * Checks: required, minimum length
	 * @param {string} value - Password to validate
	 * @returns {object} - { isValid: boolean, error: string }
	 */
	const validatePassword = (value) => {
		if (!value || !value.trim()) {
			return { isValid: false, error: "Password is required" };
		}

		const trimmed = value.trim();

		if (trimmed.length < VALIDATION_RULES.password.minLength) {
			return {
				isValid: false,
				error: `Password must be at least ${VALIDATION_RULES.password.minLength} characters`
			};
		}

		if (trimmed.length > VALIDATION_RULES.password.maxLength) {
			return {
				isValid: false,
				error: `Password cannot exceed ${VALIDATION_RULES.password.maxLength} characters`
			};
		}

		return { isValid: true, error: "" };
	};

	/**
	 * Validate entire form
	 * @returns {object} - { isValid: boolean, errors: object }
	 */
	const validateForm = () => {
		const errors = {};

		// Validate username
		const usernameValidation = validateUsername(username);
		if (!usernameValidation.isValid) {
			errors.username = usernameValidation.error;
		}

		// Validate password
		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			errors.password = passwordValidation.error;
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	};

	// ========================================
	// EVENT HANDLERS
	// ========================================

	/**
	 * Handle username input change
	 * Clears field-specific error when user starts typing
	 */
	const handleUsernameChange = (e) => {
		const value = e.target.value;
		setUsername(value);
		if (fieldErrors.username) {
			setFieldErrors({ ...fieldErrors, username: "" });
		}
	};

	/**
	 * Handle password input change
	 * Clears field-specific error when user starts typing
	 */
	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		if (fieldErrors.password) {
			setFieldErrors({ ...fieldErrors, password: "" });
		}
	};

	/**
	 * Handle form submission
	 * Validates form, sends login request, manages loading/error states
	 * @param {Event} e - Form submit event
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Reset previous messages
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

		// Prepare form data
		const formData = {
			username: username.trim(),
			password: password.trim()
		};

		try {
			setLoading(true);

			// Create axios instance with timeout
			const axiosInstance = axios.create({
				timeout: LOGIN_TIMEOUT
			});

			// Send login request
			const response = await axiosInstance.post(
				`${API_BASE_URL}/user`,
				formData
			);

			// Handle successful response
			if (response.data && response.data.success) {
				setSuccess(`Welcome ${formData.username}! Redirecting to dashboard...`);

				// Save user data to localStorage
				localStorage.setItem('user', JSON.stringify({
					username: formData.username,
					loginTime: new Date().toISOString()
				}));

				// Save credentials if "Remember Me" is checked
				if (rememberMe) {
					localStorage.setItem('rememberMe', JSON.stringify({
						username: formData.username,
						password: formData.password
					}));
				} else {
					// Clear saved credentials if "Remember Me" is unchecked
					localStorage.removeItem('rememberMe');
				}

				// Redirect to dashboard after delay
				setTimeout(() => {
					navigate('/dashboard');
				}, 1500);
			} else {
				// Handle unsuccessful login response
				setError(response.data?.message || "Login failed. Please try again.");
			}
		} catch (error) {
			// Handle different types of errors
			if (error.response?.status === 404) {
				setError("Username not found. Please check your credentials.");
			} else if (error.response?.status === 401 || error.response?.status === 400) {
				setError(error.response?.data?.message || "Invalid username or password");
			} else if (error.code === 'ECONNABORTED') {
				setError("Request timeout. The server is not responding. Please try again.");
			} else if (error.code === 'ERR_NETWORK') {
				setError("Network error. Please check your internet connection.");
			} else if (error.response?.data?.message) {
				setError(error.response.data.message);
			} else if (error.message) {
				setError(error.message);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}

			// Log error for debugging
			console.error("Login error:", error);
		} finally {
			// Stop loading regardless of outcome
			setLoading(false);
		}
	};

	/**
	 * Toggle password visibility
	 */
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	/**
	 * Handle remember me checkbox
	 */
	const handleRememberMeChange = (e) => {
		setRememberMe(e.target.checked);
		if (!e.target.checked) {
			localStorage.removeItem('rememberMe');
		}
	};

	// ========================================
	// RENDER
	// ========================================

	return (
		<>
			<div className="flex min-h-screen items-center justify-center border prefFont bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="w-full max-w-md">
					{/* Header Section */}
					<div className='relative bottom-10 z-1 mb-8'>
						<h1 className='font-bold text-5xl relative bottom-8 text-center z-0'>
							Off<span className='text-red-300'>Shore</span>
						</h1>
						<p className="text-center text-gray-600 text-sm mt-2">
							Sign in to your account to continue
						</p>
					</div>

					{/* Navigation Tabs */}
					<div className="border rounded-md flex justify-evenly relative top-14 bg-white shadow-sm">
						<Link to={"/signup"}>
							<button 
								className="m-1 w-30 border border-black p-2 logoColor rounded-md hover:bg-gray-100 transition duration-200 font-medium"
								title="Go to signup page"
							>
								Signup
							</button>
						</Link>
						<Link to={"/login"}>
							<button 
								className={button + " bg-blue-50 hover:bg-gray-100 transition duration-200 font-medium"}
								title="You are on the login page"
							>
								Login
							</button>
						</Link>
					</div>

					{/* Login Form */}
					<form 
						onSubmit={handleSubmit} 
						className="z-0 border-2 p-6 rounded-md relative bottom-16 bg-white shadow-lg"
						noValidate
					>
						<div className="z-1 relative top-10">
							{/* Alert Messages Section */}
							{error && (
								<div 
									className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md animate-pulse"
									role="alert"
									aria-live="polite"
								>
									<div className="flex items-center">
										<AlertCircle size={20} className="mr-3" />
										<span>{error}</span>
									</div>
								</div>
							)}

							{success && (
								<div 
									className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md"
									role="alert"
									aria-live="polite"
								>
									<div className="flex items-center">
										<CheckCircle size={20} className="mr-3" />
										<span>{success}</span>
									</div>
								</div>
							)}

							{/* Form Fields Container */}
							<div className="border relative bottom-0 m-1 p-4 justify-center rounded-md bg-gray-50">
								
								{/* Username Field */}
								<div className="mb-5">
									<label 
										htmlFor="username"
										className="block font-semibold mb-2 text-gray-700"
									>
										Username
										<span className="text-red-500 ml-1">*</span>
									</label>
									<div className="relative">
										<input
											id="username"
											type="text"
											name="userName"
											placeholder="Enter your username (letters, numbers, dash, underscore)"
											value={username}
											onChange={handleUsernameChange}
											className={`
												border rounded-lg p-3 w-full 
												focus:outline-none focus:ring-2 focus:ring-blue-500 
												transition duration-200
												${fieldErrors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'}
												${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
											`}
											disabled={loading}
											required
											minLength={VALIDATION_RULES.username.minLength}
											maxLength={VALIDATION_RULES.username.maxLength}
											aria-invalid={fieldErrors.username ? "true" : "false"}
											aria-describedby="username-error"
										/>
										{username && !fieldErrors.username && (
											<span className="absolute right-3 top-3 text-green-500 text-xl">✓</span>
										)}
									</div>
									{fieldErrors.username && (
										<p 
											id="username-error"
											className="mt-2 text-sm text-red-600"
										>
											{fieldErrors.username}
										</p>
									)}
								</div>

								{/* Password Field */}
								<div className="mb-5 relative">
									<label 
										htmlFor="password"
										className="block font-semibold mb-2 text-gray-700"
									>
										Password
										<span className="text-red-500 ml-1">*</span>
									</label>
									<div className="relative">
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="Enter your password"
											value={password}
											onChange={handlePasswordChange}
											className={`
												border rounded-lg p-3 w-full pr-12
												focus:outline-none focus:ring-2 focus:ring-blue-500 
												transition duration-200
												${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}
												${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}
											`}
											disabled={loading}
											required
											minLength={VALIDATION_RULES.password.minLength}
											maxLength={VALIDATION_RULES.password.maxLength}
											aria-invalid={fieldErrors.password ? "true" : "false"}
											aria-describedby="password-error"
										/>
										<button
											type="button"
											onClick={togglePasswordVisibility}
											className="absolute right-3 top-3 text-gray-600 hover:text-gray-900 focus:outline-none transition"
											disabled={loading}
											title={showPassword ? "Hide password" : "Show password"}
											aria-label={showPassword ? "Hide password" : "Show password"}
										>
											{showPassword ? (
												<EyeOff size={20} />
											) : (
												<Eye size={20} />
											)}
										</button>
									</div>
									{fieldErrors.password && (
										<p 
											id="password-error"
											className="mt-2 text-sm text-red-600"
										>
											{fieldErrors.password}
										</p>
									)}
								</div>

								{/* Remember Me Checkbox */}
								<div className="mb-6 flex items-center">
									<input
										id="rememberMe"
										type="checkbox"
										checked={rememberMe}
										onChange={handleRememberMeChange}
										disabled={loading}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
									/>
									<label 
										htmlFor="rememberMe"
										className="ml-2 text-sm text-gray-700 cursor-pointer"
									>
										Remember me next time
									</label>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading}
									className={`
										${buttonCenter} 
										font-semibold
										transition duration-300
										${loading 
											? 'opacity-70 cursor-not-allowed bg-gray-400' 
											: 'hover:bg-blue-600 hover:text-white active:scale-95'
										}
									`}
									title={loading ? "Logging in..." : "Click to login"}
									aria-busy={loading}
								>
									{loading ? (
										<span className="flex items-center justify-center">
											<span className="inline-block animate-spin mr-2">⏳</span>
											Logging in...
										</span>
									) : (
										"Login"
									)}
								</button>

								{/* Footer Text */}
								<p className="text-center text-xs text-gray-600 mt-4">
									Demo Credentials: username: <span className="font-semibold">viron</span> | password: <span className="font-semibold">1234</span>
								</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;