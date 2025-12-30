/**
 * Stats Card Component
 * Displays key metrics with trending indicators
 */

import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  trend = 0,
  icon: Icon = null,
  color = 'blue',
  subtitle = ''
}) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    red: 'from-red-400 to-red-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  };

  const isTrendingUp = trend > 0;
  const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown;

  return (
    <div className="group">
      <div className={`
        bg-gradient-to-br ${colorClasses[color]}
        rounded-xl p-6 text-white shadow-lg 
        hover:shadow-xl transition-all duration-300
        transform hover:scale-105
      `}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Icon size={24} className="text-white" />
            </div>
          )}
        </div>
        
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${isTrendingUp ? 'text-green-100' : 'text-red-100'}`}>
            <TrendIcon size={16} />
            <span>{Math.abs(trend)}% from last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
