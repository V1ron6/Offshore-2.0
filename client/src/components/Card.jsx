/**
 * ========================================
 * Card Component
 * ========================================
 * 
 * Reusable card component for content containers.
 * 
 * Props:
 * - title: string - Card title
 * - children: ReactNode - Card content
 * - className: string - Additional classes
 * - icon: ReactComponent - Optional icon
 */

const Card = ({ 
	title, 
	children, 
	className = '',
	icon: Icon = null,
	action = null 
}) => {
	return (
		<div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${className}`}>
			{/* Header */}
			{(title || Icon || action) && (
				<div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
					<div className="flex items-center space-x-3">
						{Icon && <Icon size={24} className="text-red-500" />}
						{title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
					</div>
					{action && <div>{action}</div>}
				</div>
			)}

			{/* Content */}
			<div>{children}</div>
		</div>
	);
};

export default Card;
