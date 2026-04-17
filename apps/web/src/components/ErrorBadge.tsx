import { useState, useEffect } from 'react';
import { XCircle, X } from 'lucide-react';

interface ErrorBadgeProps {
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const ErrorBadge = ({ 
  title = 'Error', 
  message, 
  duration = 5000,
  onClose 
}: ErrorBadgeProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsAnimating(true), 10);

    // Auto-hide after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border-l-4 border-red-500 flex items-center gap-4 px-6 py-4 min-w-[400px] max-w-[600px]">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-0.5">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Hook for managing error badge
export const useErrorBadge = () => {
  const [badge, setBadge] = useState<{
    title?: string;
    message: string;
    duration?: number;
  } | null>(null);

  const showError = (message: string, title?: string, duration?: number) => {
    setBadge({ message, title, duration });
  };

  const hideError = () => {
    setBadge(null);
  };

  const ErrorBadgeComponent = badge ? (
    <ErrorBadge
      title={badge.title}
      message={badge.message}
      duration={badge.duration}
      onClose={hideError}
    />
  ) : null;

  return {
    showError,
    hideError,
    ErrorBadgeComponent,
  };
};
