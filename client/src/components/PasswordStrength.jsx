/**
 * PasswordStrength Component - Visual feedback on signup
 */

import { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';

// Password requirements
const requirements = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'One special character', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) }
];

// Calculate strength level
const calculateStrength = (password) => {
  if (!password) return { level: 0, label: '', color: 'bg-gray-200' };
  
  const passedRequirements = requirements.filter(req => req.test(password)).length;
  
  if (passedRequirements <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
  if (passedRequirements === 2) return { level: 2, label: 'Fair', color: 'bg-orange-500' };
  if (passedRequirements === 3) return { level: 3, label: 'Good', color: 'bg-yellow-500' };
  if (passedRequirements === 4) return { level: 4, label: 'Strong', color: 'bg-green-500' };
  return { level: 5, label: 'Excellent', color: 'bg-green-600' };
};

const PasswordStrength = ({ password, showRequirements = true }) => {
  const [strength, setStrength] = useState({ level: 0, label: '', color: 'bg-gray-200' });
  const [passedRequirements, setPassedRequirements] = useState([]);

  useEffect(() => {
    setStrength(calculateStrength(password));
    setPassedRequirements(
      requirements.filter(req => req.test(password || '')).map(req => req.id)
    );
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Password strength</span>
          <span className={`text-xs font-medium ${
            strength.level <= 2 ? 'text-red-500' : 
            strength.level === 3 ? 'text-yellow-500' : 
            'text-green-500'
          }`}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.level / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {requirements.map((req) => {
            const passed = passedRequirements.includes(req.id);
            return (
              <div
                key={req.id}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  passed 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {passed ? (
                  <Check size={14} className="shrink-0" />
                ) : (
                  <X size={14} className="shrink-0" />
                )}
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Password Input with toggle visibility and strength meter
export const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Password',
  name = 'password',
  showStrength = true,
  showRequirements = true,
  error = '',
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {showStrength && value && (
        <PasswordStrength password={value} showRequirements={showRequirements} />
      )}
    </div>
  );
};

export default PasswordStrength;
