/**
 * ========================================
 * Form Input Component
 * ========================================
 * 
 * Reusable form input with validation and error states.
 * 
 * Props:
 * - label: string - Input label
 * - type: string - Input type (text, email, password, etc.)
 * - value: string - Input value
 * - onChange: function - Change handler
 * - placeholder: string - Placeholder text
 * - error: string - Error message
 * - required: boolean - Is required
 * - disabled: boolean - Disabled state
 * - icon: ReactComponent - Optional icon
 */

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const FormInput = ({
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	error = '',
	required = false,
	disabled = false,
	icon: Icon = null,
	minLength,
	maxLength
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === 'password';
	const inputType = isPassword && showPassword ? 'text' : type;

	return (
		<div className="mb-4">
			{label && (
				<label className="block font-semibold mb-2 text-gray-700">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			<div className="relative">
				{Icon && (
					<div className="absolute left-3 top-3 text-gray-400">
						<Icon size={20} />
					</div>
				)}

				<input
					type={inputType}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					disabled={disabled}
					minLength={minLength}
					maxLength={maxLength}
					className={`
						w-full border rounded-lg p-3 transition duration-200
						${Icon ? 'pl-10' : ''}
						${isPassword && value ? 'pr-10' : ''}
						focus:outline-none focus:ring-2 focus:ring-blue-500
						${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
						${disabled ? 'bg-gray-200 cursor-not-allowed opacity-60' : ''}
					`}
					aria-invalid={error ? 'true' : 'false'}
					aria-describedby={error ? `${label}-error` : undefined}
				/>

				{isPassword && value && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-3 text-gray-600 hover:text-gray-900 transition"
						title={showPassword ? "Hide password" : "Show password"}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				)}

				{value && !error && (
					<span className="absolute right-3 top-3 text-green-500 text-lg">✓</span>
				)}
			</div>

			{error && (
				<p id={`${label}-error`} className="mt-2 text-sm text-red-600">
					{error}
				</p>
			)}
		</div>
	);
};

export default FormInput;
