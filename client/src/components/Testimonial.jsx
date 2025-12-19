/**
 * Testimonial Component
 * Display user testimonials
 */

import { Star } from 'lucide-react';

const Testimonial = ({
  quote,
  author,
  role,
  image = null,
  rating = 5
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 mb-6 italic">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {image && (
          <img
            src={image}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
