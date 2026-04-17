import { useState } from 'react';
import { useErrorBadge } from './ErrorBadge';

export const ErrorBadgeDemo = () => {
  const { showError, ErrorBadgeComponent } = useErrorBadge();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBasicError = () => {
    showError('Failed to complete the action. Please try again.');
  };

  const handleCustomTitleError = () => {
    showError('Network connection failed', 'Connection Error');
  };

  const handleLongDurationError = () => {
    showError('This error will stay visible for 10 seconds', 'Error', 10000);
  };

  const handlePersistentError = () => {
    showError('This error will not auto-dismiss. Click X to close.', 'Critical Error', 0);
  };

  const handleApiError = () => {
    showError('Unable to fetch data from the server. Please check your connection.', 'API Error');
  };

  const handleValidationError = () => {
    showError('Please fill in all required fields before submitting', 'Validation Error');
  };

  const handleAuthError = () => {
    showError('Invalid email or password. Please try again.', 'Authentication Failed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {ErrorBadgeComponent}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Badge Demo</h1>
        <p className="text-gray-600 mb-8">
          Test the error badge component with different configurations
        </p>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleBasicError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show Basic Error
          </button>

          <button
            onClick={handleCustomTitleError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show Custom Title Error
          </button>

          <button
            onClick={handleLongDurationError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show Long Duration (10s)
          </button>

          <button
            onClick={handlePersistentError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show Persistent Error
          </button>

          <button
            onClick={handleApiError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show API Error
          </button>

          <button
            onClick={handleValidationError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show Validation Error
          </button>

          <button
            onClick={handleAuthError}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Show Auth Error
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Test with Modal
          </button>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✓</span>
              <span>Appears above all modals and layouts (z-index: 9999)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✓</span>
              <span>Smooth slide-down entrance and fade-out exit animations</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✓</span>
              <span>Auto-dismisses after 5 seconds (configurable)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✓</span>
              <span>Manual close with X button</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✓</span>
              <span>Customizable title, message, and duration</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✓</span>
              <span>Red left border and error icon for clear error indication</span>
            </li>
          </ul>
        </div>

        {/* Code Example */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usage Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useErrorBadge } from './components';

function MyComponent() {
  const { showError, ErrorBadgeComponent } = useErrorBadge();

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      showError('Failed to complete the action. Please try again.');
    }
  };

  return (
    <>
      {ErrorBadgeComponent}
      <button onClick={handleApiCall}>
        Submit
      </button>
    </>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Test Modal</h3>
            <p className="text-gray-600 mb-6">
              The error badge should appear above this modal when you click the button below.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleApiError}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Show Error
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
