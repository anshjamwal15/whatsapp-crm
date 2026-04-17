# Success Badge Component

A custom success notification badge that appears at the top of the screen, above all modals and layouts.

## Features

- ✅ **High z-index (9999)**: Appears on top of all modals and layouts
- ✅ **Smooth animations**: Slide-down entrance and fade-out exit
- ✅ **Auto-dismiss**: Automatically closes after a configurable duration (default: 5 seconds)
- ✅ **Manual close**: Users can close the badge manually with the X button
- ✅ **Customizable**: Title, message, and duration can be customized
- ✅ **Clean design**: Matches the screenshot with green left border and check icon

## Usage

### Basic Usage with Hook

```tsx
import { useSuccessBadge } from './components';

function MyComponent() {
  const { showSuccess, SuccessBadgeComponent } = useSuccessBadge();

  const handleAction = () => {
    // Your action logic here
    showSuccess('Conversation assigned to Samantha Reed');
  };

  return (
    <>
      {SuccessBadgeComponent}
      <button onClick={handleAction}>
        Assign Conversation
      </button>
    </>
  );
}
```

### With Custom Title

```tsx
showSuccess('Conversation assigned to Samantha Reed', 'Success');
```

### With Custom Duration

```tsx
showSuccess('Conversation assigned to Samantha Reed', 'Success', 3000); // 3 seconds
```

### Disable Auto-dismiss

```tsx
showSuccess('Important message', 'Success', 0); // Won't auto-dismiss
```

## API

### `useSuccessBadge()` Hook

Returns an object with:

- `showSuccess(message: string, title?: string, duration?: number)`: Function to show the success badge
- `hideSuccess()`: Function to manually hide the success badge
- `SuccessBadgeComponent`: React component to render in your JSX

### `SuccessBadge` Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Success'` | The title text displayed in bold |
| `message` | `string` | Required | The message text displayed below the title |
| `duration` | `number` | `5000` | Auto-dismiss duration in milliseconds (0 to disable) |
| `onClose` | `() => void` | `undefined` | Callback function when badge is closed |

## Examples

### Example 1: Workspace Onboarding

```tsx
import { useSuccessBadge } from '../../../components';

export const WorkspaceOnboarding = () => {
  const { showSuccess, SuccessBadgeComponent } = useSuccessBadge();

  const handleContinue = () => {
    showSuccess('Workspace setup completed successfully!');
    // Navigate to next step
  };

  return (
    <>
      {SuccessBadgeComponent}
      {/* Your component content */}
    </>
  );
};
```

### Example 2: Team Member Invitation

```tsx
const handleInviteMember = () => {
  // Invite logic
  showSuccess(`Invitation sent to ${memberName}`, 'Success');
};
```

### Example 3: Form Submission

```tsx
const handleSubmit = async () => {
  try {
    await submitForm();
    showSuccess('Form submitted successfully!', 'Success', 4000);
  } catch (error) {
    // Handle error
  }
};
```

## Styling

The component uses Tailwind CSS classes and includes:

- White background with shadow
- Green left border (4px)
- Green circular icon with white checkmark
- Responsive width (min: 400px, max: 600px)
- Centered at the top of the screen
- Smooth transitions for all animations

## Z-Index Hierarchy

The success badge uses `z-[9999]` to ensure it appears above:
- Modals (typically z-50 to z-100)
- Dropdowns (typically z-40 to z-50)
- Fixed headers (typically z-30 to z-40)
- All other content

## Demo

A demo component is available at `apps/web/src/components/SuccessBadgeDemo.tsx` that showcases:
- Basic usage
- Interaction with modals
- Feature list
- Code examples

## Browser Support

Works in all modern browsers that support:
- CSS transforms
- CSS transitions
- Flexbox
- CSS Grid (for demo page)

## Accessibility

- Includes `aria-label` on close button
- Keyboard accessible (close button can be focused and activated with Enter/Space)
- Semantic HTML structure
- Clear visual hierarchy
