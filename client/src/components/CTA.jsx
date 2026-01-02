/**
 * ========================================
 * CTA (Call-To-Action) Component
 * ========================================
 * 
 * Interactive action banner for promotions.
 * 
 * Props:
 * - title: string - Banner title
 * - description: string - Banner description
 * - features: array - Feature list
 * - buttonText: string - CTA button text
 * - onButtonClick: function - Button click handler
 * - variant: 'primary' | 'gradient' | 'dark' - Style variant
 * 
 * USAGE:
 * Create promotional banners or action sections.
 * 
 * Example:
 * <CTA 
 *   title="Limited Time Offer" 
 *   description="Get 50% off all products this week"
 *   features={['Free shipping', 'Easy returns', 'Money back guarantee']}
 *   buttonText="Shop Now"
 *   onButtonClick={() => navigate('/shop')}
 *   variant="gradient"
 * />
 * 
 * <CTA 
 *   title="Premium Membership"
 *   description="Unlock exclusive benefits and rewards"
 *   buttonText="Upgrade Now"
 *   variant="dark"
 * />
 */

import { CheckCircle2 } from 'lucide-react';

const CTA = ({
  title,
  description,
  features = [],
  buttonText,
  onButtonClick,
  variant = 'primary'
}) => {
  const variants = {
    primary: 'from-red-500 to-red-600',
    gradient: 'from-purple-500 via-red-500 to-orange-500',
    dark: 'from-gray-800 to-gray-900'
  };

  return (
    <div className={`
      bg-gradient-to-r ${variants[variant]}
      rounded-2xl p-8 md:p-12
      text-white overflow-hidden relative
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {title}
        </h2>

        <p className="text-lg text-white text-opacity-90 mb-6">
          {description}
        </p>

        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onButtonClick}
          className="
            px-8 py-3 bg-white text-red-500 rounded-lg
            font-bold hover:bg-opacity-90 transition
            inline-block
          "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CTA;
