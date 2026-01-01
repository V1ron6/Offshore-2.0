/**
 * ========================================
 * Button Component
 * ========================================
 * 
 * Reusable button component with variants.
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' - Button style
 * - size: 'sm' | 'md' | 'lg' - Button size
 * - isLoading: boolean - Show loading state
 * - disabled: boolean - Disable button
 * - onClick: function - Click handler
 * - children: ReactNode - Button text/content
 * - icon: ReactComponent - Optional icon
 * - className: string - Additional classes
 * - fullWidth: boolean - Full width button
 */

const Button = ({
	variant = 'primary',
	size = 'md',
	isLoading = false,
	disabled = false,
	onClick,
	children,
	icon: Icon = null,
	className = '',
	fullWidth = false,
	type = 'button'
}) => {
	const variantClasses = {
		primary: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
		secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
		danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
		ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 rounded-md'
	};

	const sizeClasses = {
		sm: 'px-3 py-1 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	const isDisabled = disabled || isLoading;

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isDisabled}
			className={`
				${variantClasses[variant]}
				${sizeClasses[size]}
				${fullWidth ? 'w-full' : ''}
				rounded-lg font-semibold transition duration-200 
				flex items-center justify-center space-x-2
				${isDisabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
				${className}
			`}
		>
			{isLoading && (
				<span className="inline-block animate-spin">|</span>
			)}
			{Icon && !isLoading && <Icon size={20} />}
			<span>{children}</span>
		</button>
	);
};

export default Button;
