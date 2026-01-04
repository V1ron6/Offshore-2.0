/**
 * KeyboardShortcuts Component - Quick actions with keyboard
 */

/* eslint-disable react-refresh/only-export-components */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X } from 'lucide-react';

// Keyboard shortcut definitions
const shortcuts = [
  { keys: ['/', 'Ctrl+K'], action: 'search', description: 'Open search' },
  { keys: ['g', 'h'], action: 'home', description: 'Go to home' },
  { keys: ['g', 'c'], action: 'cart', description: 'Go to cart' },
  { keys: ['g', 'o'], action: 'orders', description: 'Go to orders' },
  { keys: ['g', 'p'], action: 'profile', description: 'Go to profile' },
  { keys: ['g', 'w'], action: 'wishlist', description: 'Go to wishlist' },
  { keys: ['?'], action: 'help', description: 'Show keyboard shortcuts' },
  { keys: ['Escape'], action: 'close', description: 'Close dialogs' },
];

// Hook for keyboard shortcuts
export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pendingKey, setPendingKey] = useState(null);

  const handleAction = useCallback((action) => {
    switch (action) {
      case 'search':
        setShowSearch(true);
        break;
      case 'home':
        navigate('/');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'help':
        setShowHelp(prev => !prev);
        break;
      case 'close':
        setShowHelp(false);
        setShowSearch(false);
        break;
      default:
        break;
    }
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      // Ctrl+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleAction('search');
        return;
      }

      // Single key shortcuts
      if (e.key === '/') {
        e.preventDefault();
        handleAction('search');
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        handleAction('help');
        return;
      }

      if (e.key === 'Escape') {
        handleAction('close');
        return;
      }

      // Two-key shortcuts (g + letter)
      if (pendingKey === 'g') {
        e.preventDefault();
        switch (e.key) {
          case 'h': handleAction('home'); break;
          case 'c': handleAction('cart'); break;
          case 'o': handleAction('orders'); break;
          case 'p': handleAction('profile'); break;
          case 'w': handleAction('wishlist'); break;
        }
        setPendingKey(null);
        return;
      }

      if (e.key === 'g') {
        setPendingKey('g');
        // Clear pending key after 1 second
        setTimeout(() => setPendingKey(null), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, pendingKey]);

  return { showHelp, setShowHelp, showSearch, setShowSearch };
};

// Keyboard shortcuts help modal
export const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Command size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Navigation
            </h3>
            <div className="space-y-2">
              {shortcuts.filter(s => s.action.startsWith('g') || ['home', 'cart', 'orders', 'profile', 'wishlist'].includes(s.action)).map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Actions
            </h3>
            <div className="space-y-2">
              {shortcuts.filter(s => ['search', 'help', 'close'].includes(s.action)).map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono">?</kbd> anytime to show this help
          </p>
        </div>
      </div>
    </div>
  );
};

// Command palette / quick search
export const CommandPalette = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const quickLinks = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Products', path: '/categories', icon: '🛍️' },
    { label: 'Cart', path: '/cart', icon: '🛒' },
    { label: 'Orders', path: '/orders', icon: '📦' },
    { label: 'Wishlist', path: '/wishlist', icon: '❤️' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Help', path: '/complaints', icon: '💬' },
  ];

  const filteredLinks = query
    ? quickLinks.filter(link => 
        link.label.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const handleSearch = () => {
    if (onSearch && query) {
      onSearch(query);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center pt-[20vh] p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Search or type a command..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Quick Links */}
        <div className="max-h-[40vh] overflow-y-auto">
          {filteredLinks.length > 0 ? (
            <div className="p-2">
              {filteredLinks.map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(link.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-gray-900 dark:text-white">{link.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Type to search products</span>
          <div className="flex items-center gap-2">
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded font-mono">↑↓</kbd>
            <span>Select</span>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded font-mono">Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
