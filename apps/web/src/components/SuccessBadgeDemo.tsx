import { useSuccessBadge } from './SuccessBadge';

export const SuccessBadgeDemo = () => {
  const { showSuccess, SuccessBadgeComponent } = useSuccessBadge();

  const handleShowSuccess = () => {
    showSuccess('Conversation assigned to Samantha Reed', 'Success');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      {/* Success Badge Component */}
      {SuccessBadgeComponent}

      {/* Demo Content */}
      <div className="max-w-4xl w-full space-y-8">
        {/* Demo Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Success Badge Demo</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to see the success badge appear at the top of the screen.
            The badge will appear on top of all modals and layouts with z-index 9999.
          </p>

          <button
            onClick={handleShowSuccess}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Show Success Badge
          </button>
        </div>

        {/* Example Modal to demonstrate z-index */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative z-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Example Modal</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              z-index: 50
            </span>
          </div>
          <p className="text-gray-600 mb-6">
            This is a modal with z-index 50. The success badge (z-index 9999) will appear on top of this modal.
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Assign Conversation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Select a team member to assign this conversation to.
            </p>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    SR
                  </div>
                  <span className="font-medium text-gray-900">Samantha Reed</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    JD
                  </div>
                  <span className="font-medium text-gray-900">John Doe</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Appears on top of all modals and layouts (z-index: 9999)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Smooth slide-down animation on appearance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Auto-dismisses after 5 seconds (configurable)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Manual close button with smooth fade-out</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Green left border and check icon matching the design</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Customizable title and message</span>
            </li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Usage Example</h2>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
            <code>{`import { useSuccessBadge } from './components';

function MyComponent() {
  const { showSuccess, SuccessBadgeComponent } = useSuccessBadge();

  const handleAction = () => {
    // Your action logic here
    showSuccess('Conversation assigned to Samantha Reed', 'Success');
  };

  return (
    <>
      {SuccessBadgeComponent}
      <button onClick={handleAction}>
        Assign Conversation
      </button>
    </>
  );
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
