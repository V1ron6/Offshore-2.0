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
 * 
 * USAGE:
 * Use to wrap content in a styled container with optional header.
 * 
 * Example:
 * <Card 
 *   title="Order Summary" 
 *   icon={ShoppingCart}
 * >
 *   <div>Order ID: #12345</div>
 *   <div>Total: $99.99</div>
 * </Card>
 * 
 * <Card className="bg-blue-50">
 *   <p>This is a simple card without a header</p>
 * </Card>
 * 
 * <Card 
 *   title="Account Settings"
 *   icon={Settings}
 *   action={<Button size="sm">Edit</Button>}
 * >
 *   <form>
 *     
 *   </form>
 * </Card>
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
