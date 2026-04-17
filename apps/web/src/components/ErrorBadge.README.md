# Error Badge Component

A custom error notification badge that appears at the top of the screen when API errors occur, above all modals and layouts.

## Features

- ✅ **High z-index (9999)**: Appears on top of all modals and layouts
- ✅ **Smooth animations**: Slide-down entrance and fade-out exit
- ✅ **Auto-dismiss**: Automatically closes after a configurable duration (default: 5 seconds)
- ✅ **Manual close**: Users can close the badge manually with the X button
- ✅ **Customizable**: Title, message, and duration can be customized
- ✅ **Clean design**: Red left border and error icon for clear error indication

## Usage

### Basic Usage with Hook

```tsx
import { useErrorBadge } from './components';

function MyComponent() {
  const { showError, ErrorBadgeComponent } = useErrorBadge();

  const handleAction = async () => {
    try {
      await apiCall();
    } catch (error) {
      showError('Failed to complete the action. Please try again.');
    }
  };

  return (
    <>
      {ErrorBadgeComponent}
      <button onClick={handleAction}>
        Submit
      </button>
    </>
  );
}
```

### With Custom Title

```tsx
showError('Network connection failed', 'Connection Error');
```

### With Custom Duration

```tsx
showError('Failed to save changes', 'Error', 7000); // 7 seconds
```

### Disable Auto-dismiss

```tsx
showError('Critical error - please contact support', 'Error', 0); // Won't auto-dismiss
```

### API Error Handling

```tsx
const handleApiCall = async () => {
  try {
    const response = await fetch('/api/endpoint');
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    // Handle success
  } catch (error) {
    showError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'API Error'
    );
  }
};
```

## API

### `useErrorBadge()` Hook

Returns an object with:

- `showError(message: string, title?: string, duration?: number)`: Function to show the error badge
- `hideError()`: Function to manually hide the error badge
- `ErrorBadgeComponent`: React component to render in your JSX

### `ErrorBadge` Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Error'` | The title text displayed in bold |
| `message` | `string` | Required | The error message text displayed below the title |
| `duration` | `number` | `5000` | Auto-dismiss duration in milliseconds (0 to disable) |
| `onClose` | `() => void` | `undefined` | Callback function when badge is closed |

## Examples

### Example 1: Form Submission Error

```tsx
import { useErrorBadge } from '../../../components';

export const MyForm = () => {
  const { showError, ErrorBadgeComponent } = useErrorBadge();

  const handleSubmit = async (data: FormData) => {
    try {
      await submitForm(data);
    } catch (error) {
      showError('Failed to submit form. Please check your input and try again.');
    }
  };

  return (
    <>
      {ErrorBadgeComponent}
      {/* Your form content */}
    </>
  );
};
```

### Example 2: Authentication Error

```tsx
const handleLogin = async () => {
  try {
    await login(credentials);
  } catch (error) {
    showError('Invalid email or password', 'Authentication Failed');
  }
};
```

### Example 3: Network Error

```tsx
const fetchData = async () => {
  try {
    const data = await api.getData();
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      showError('Unable to connect to server. Please check your internet connection.', 'Network Error', 0);
    } else {
      showError('Something went wrong. Please try again later.');
    }
  }
};
```

### Example 4: Validation Error

```tsx
const handleSave = async () => {
  if (!isValid) {
    showError('Please fill in all required fields', 'Validation Error');
    return;
  }
  // Continue with save
};
```

## Styling

The component uses Tailwind CSS classes and includes:

- White background with shadow
- Red left border (4px)
- Red circular icon with white X icon
- Responsive width (min: 400px, max: 600px)
- Centered at the top of the screen
- Smooth transitions for all animations

## Z-Index Hierarchy

The error badge uses `z-[9999]` to ensure it appears above:
- Modals (typically z-50 to z-100)
- Dropdowns (typically z-40 to z-50)
- Fixed headers (typically z-30 to z-40)
- All other content

## Best Practices

1. **Clear Messages**: Provide specific, actionable error messages
2. **User-Friendly Language**: Avoid technical jargon when possible
3. **Appropriate Duration**: Use longer durations for critical errors
4. **Error Recovery**: Include suggestions for how to resolve the error when possible
5. **Logging**: Consider logging errors to your monitoring system while showing user-friendly messages

## Browser Support

Works in all modern browsers that support:
- CSS transforms
- CSS transitions
- Flexbox

## Accessibility

- Includes `aria-label` on close button
- Keyboard accessible (close button can be focused and activated with Enter/Space)
- Semantic HTML structure
- Clear visual hierarchy
- High contrast red color for error indication
