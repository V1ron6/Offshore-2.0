/**
 * ========================================
 * Feature Card Component
 * ========================================
 * 
 * Showcase features with icons and descriptions.
 * 
 * Props:
 * - icon: ReactComponent - Icon component
 * - title: string - Feature title
 * - description: string - Feature description
 * - onClick: function - Optional click handler
 * - index: number - Card index for color cycling
 * 
 * USAGE:
 * Display product features or service highlights.
 * 
 * Example:
 * <FeatureCard 
 *   icon={Truck} 
 *   title="Fast Shipping" 
 *   description="Free delivery on orders over $50"
 *   index={0}
 * />
 * 
 * <div className="grid grid-cols-3 gap-4">
 *   <FeatureCard icon={Shield} title="Secure" description="SSL encrypted" index={0} />
 *   <FeatureCard icon={Zap} title="Fast" description="Lightning quick" index={1} />
 *   <FeatureCard icon={Users} title="Support" description="24/7 support" index={2} />
 * </div>
 */

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  onClick = null,
  index = 0
}) => {
  const colors = ['blue', 'green', 'red', 'purple', 'orange'];
  const color = colors[index % colors.length];

  const colorClasses = {
    blue: 'from-blue-50 to-cyan-50 border-blue-200 hover:shadow-blue-200',
    green: 'from-green-50 to-emerald-50 border-green-200 hover:shadow-green-200',
    red: 'from-red-50 to-rose-50 border-red-200 hover:shadow-red-200',
    purple: 'from-purple-50 to-indigo-50 border-purple-200 hover:shadow-purple-200',
    orange: 'from-orange-50 to-amber-50 border-orange-200 hover:shadow-orange-200'
  };

  const iconColors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-gradient-to-br ${colorClasses[color]}
        border border-gray-200
        rounded-xl p-6
        hover:shadow-xl ${colorClasses[color].includes('blue') ? 'hover:shadow-blue-200' : ''}
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        group
      `}
    >
      <div className={`${iconColors[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
