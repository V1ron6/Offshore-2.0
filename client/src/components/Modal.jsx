/**
 * ========================================
 * Modal Component
 * ========================================
 * 
 * Reusable modal dialog component.
 * 
 * Props:
 * - isOpen: boolean - Modal visibility
 * - onClose: function - Close handler
 * - title: string - Modal title
 * - children: ReactNode - Modal content
 * - actions: array - Action buttons
 * - size: 'sm' | 'md' | 'lg' - Modal size
 * 
 * USAGE:
 * Display modal dialogs for confirmations, forms, or alerts.
 * 
 * Example:
 * <Modal 
 *   isOpen={showDeleteModal} 
 *   onClose={() => setShowDeleteModal(false)}
 *   title="Confirm Delete"
 *   size="sm"
 *   actions={[
 *     { label: 'Cancel', onClick: () => setShowDeleteModal(false) },
 *     { label: 'Delete', onClick: handleDelete, variant: 'danger' }
 *   ]}
 * >
 *   <p>Are you sure you want to delete this item?</p>
 * </Modal>
 * 
 * <Modal 
 *   isOpen={showFormModal} 
 *   onClose={closeModal}
 *   title="Edit Product"
 *   size="lg"
 * >
 *   <ProductForm onSubmit={handleSubmit} />
 * </Modal>
 */

import { X } from 'lucide-react';

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	actions = [],
	size = 'md'
}) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg'
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]}`}>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-600 hover:text-gray-900 transition"
						aria-label="Close modal"
					>
						<X size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{children}
				</div>

				{/* Footer */}
				{actions.length > 0 && (
					<div className="flex gap-3 p-6 border-t border-gray-200">
						{actions.map((action, index) => (
							<button
								key={index}
								onClick={action.onClick}
								className={`
									px-4 py-2 rounded-lg font-semibold transition
									${action.variant === 'danger'
										? 'bg-red-500 text-white hover:bg-red-600'
										: action.variant === 'secondary'
											? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
											: 'bg-blue-500 text-white hover:bg-blue-600'
									}
									${action.fullWidth ? 'flex-1' : ''}
								`}
							>
								{action.label}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
