/**
 * ========================================
 * Hero Section Component
 * ========================================
 * 
 * Eye-catching banner for pages with title, 
 * subtitle, and call-to-action buttons.
 * 
 * Props:
 * - title: string - Hero title
 * - subtitle: string - Hero subtitle
 * - cta: object - Primary button {label, onClick}
 * - ctaSecondary: object - Secondary button {label, onClick}
 * - bgColor: string - Gradient color classes
 * 
 * USAGE:
 * Create prominent hero sections on landing/category pages.
 * 
 * Example:
 * <Hero 
 *   title="Welcome to Offshore" 
 *   subtitle="Shop the latest products with exclusive deals"
 *   cta={{ label: 'Shop Now', onClick: () => navigate('/shop') }}
 *   ctaSecondary={{ label: 'Learn More', onClick: () => navigate('/about') }}
 *   bgColor="from-red-500 to-orange-600"
 * />
 * 
 * <Hero 
 *   title="Flash Sale - 50% Off" 
 *   subtitle="Limited time offer on selected items"
 *   cta={{ label: 'Shop Sale', onClick: handleShopSale }}
 *   bgColor="from-purple-500 via-red-500 to-orange-500"
 * />
 */

import { ArrowRight, Zap } from 'lucide-react';

const Hero = ({
  title,
  subtitle,
  cta,
  ctaSecondary,
  bgColor = 'from-red-500 to-orange-600'
}) => {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-8 md:p-16
      bg-gradient-to-r ${bgColor}
      text-white shadow-2xl
    `}>
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-yellow-300" />
          <span className="text-sm font-semibold">Enterprise Solution</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {title}
        </h1>

        <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {cta && (
            <button onClick={cta.onClick} className="
              px-8 py-3 bg-white text-red-500 rounded-lg
              font-bold hover:bg-opacity-90 transition
              flex items-center justify-center gap-2
            ">
              {cta.label}
              <ArrowRight size={20} />
            </button>
          )}
          {ctaSecondary && (
            <button onClick={ctaSecondary.onClick} className="
              px-8 py-3 border-2 border-white text-white rounded-lg
              font-bold hover:bg-white hover:bg-opacity-10 transition
            ">
              {ctaSecondary.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
