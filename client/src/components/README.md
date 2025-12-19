# Frontend Components Documentation

## Overview

This directory contains reusable, production-ready React components built with Tailwind CSS and Lucide React icons.

## Components

### 1. **Alert** (`Alert.jsx`)

Reusable alert component for notifications.

**Props:**

- `type`: 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `message`: Alert message string
- `onClose`: Callback function when alert closes
- `dismissible`: boolean - Can user close alert (default: true)
- `className`: Additional CSS classes

**Usage:**

```jsx
<Alert
  type="success"
  message="Profile updated successfully!"
  onClose={() => setShowAlert(false)}
  dismissible={true}
/>
```

---

### 2. **Button** (`Button.jsx`)

Flexible button component with multiple variants and states.

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `isLoading`: boolean - Show loading state
- `disabled`: boolean - Disable button
- `onClick`: Click handler function
- `icon`: React component - Icon to display
- `fullWidth`: boolean - Full width button
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `className`: Additional CSS classes

**Usage:**

```jsx
<Button
  variant="primary"
  size="md"
  onClick={handleClick}
  icon={Heart}
  isLoading={loading}
>
  Like Post
</Button>
```

---

### 3. **Card** (`Card.jsx`)

Container component for organizing content.

**Props:**

- `title`: string - Card title
- `children`: ReactNode - Card content
- `icon`: React component - Optional icon
- `action`: ReactNode - Optional action element in header
- `className`: Additional CSS classes

**Usage:**

```jsx
<Card title="Account Settings" icon={Settings} action={<EditButton />}>
  <p>Your account settings go here</p>
</Card>
```

---

### 4. **FormInput** (`FormInput.jsx`)

Enhanced form input with validation and visibility toggle.

**Props:**

- `label`: string - Input label
- `type`: string - Input type (default: 'text')
- `value`: string - Input value
- `onChange`: Change handler function
- `placeholder`: string - Placeholder text
- `error`: string - Error message
- `required`: boolean - Is required field
- `disabled`: boolean - Disable input
- `icon`: React component - Optional icon
- `minLength`: number - Minimum length
- `maxLength`: number - Maximum length

**Usage:**

```jsx
<FormInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  error={emailError}
  required={true}
  icon={Mail}
/>
```

---

### 5. **LoadingSpinner** (`LoadingSpinner.jsx`)

Animated loading spinner for async operations.

**Props:**

- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `color`: Tailwind color class (default: 'text-blue-500')
- `message`: string - Optional loading message

**Usage:**

```jsx
<LoadingSpinner size="lg" color="text-red-500" message="Saving changes..." />
```

---

### 6. **Modal** (`Modal.jsx`)

Dialog component for important user interactions.

**Props:**

- `isOpen`: boolean - Modal visibility
- `onClose`: Close handler function
- `title`: string - Modal title
- `children`: ReactNode - Modal content
- `actions`: array - Action buttons configuration
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Actions Configuration:**

```jsx
[
  {
    label: "Cancel",
    onClick: handleCancel,
    variant: "secondary",
  },
  {
    label: "Delete",
    onClick: handleDelete,
    variant: "danger",
    fullWidth: true,
  },
];
```

**Usage:**

```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Delete"
  actions={[
    { label: "Cancel", onClick: () => setShowModal(false) },
    { label: "Delete", onClick: handleDelete, variant: "danger" },
  ]}
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

---

## Styling

All components use **Tailwind CSS** for styling. They follow a consistent design system:

- **Colors**: Red (#ef4444) as primary, Gray as secondary
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with size variants
- **Icons**: Lucide React icons throughout

## Accessibility

All components include:

- ARIA labels and descriptions
- Semantic HTML
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Best Practices

1. **Always provide labels** for form inputs
2. **Use meaningful icon choices** from Lucide React
3. **Handle loading states** properly
4. **Provide error messages** to users
5. **Test with keyboard navigation**
6. **Use proper button types** (submit, button, reset)

## Integration with Pages

Components are used throughout the application:

- **Login Page**: FormInput, Alert, Button, LoadingSpinner
- **Dashboard**: Card, Button, Alert, LoadingSpinner
- **Profile**: Card, Button, Alert, FormInput
- **Home**: Card, Button

## Future Enhancements

- [ ] Toast notifications component
- [ ] Dropdown menu component
- [ ] Pagination component
- [ ] Table component
- [ ] Breadcrumb component
- [ ] Skeleton loading component
