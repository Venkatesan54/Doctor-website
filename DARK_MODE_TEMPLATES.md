# Dark Mode Quick Reference & Code Templates

## Quick Setup for New Components

### 1. Import the useTheme hook
```jsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();
  // ... rest of component
}
```

### 2. Apply dark mode classes
```jsx
// Simple card
<div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-lg">
  <h2 className="text-slate-900 dark:text-white">Heading</h2>
  <p className="text-slate-600 dark:text-slate-400">Description</p>
</div>
```

## Complete Component Example

```jsx
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ExampleComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My App
            </h1>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-md p-6 hover:shadow-lg dark:hover:shadow-blue-900/20 transition"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Card {item}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                This is a sample card content that works in both light and dark modes.
              </p>
              <button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded-lg transition font-semibold">
                Action
              </button>
            </div>
          ))}
        </div>

        {/* Form Example */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Form Example
          </h2>
          <form className="max-w-md space-y-4 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Message
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition resize-none"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded-lg transition font-semibold"
            >
              Submit
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ExampleComponent;
```

## Color Palette Reference

### Backgrounds
```
Light Mode → Dark Mode
bg-white → dark:bg-slate-800
bg-slate-50 → dark:bg-slate-900
bg-slate-100 → dark:bg-slate-700
bg-blue-50 → dark:bg-blue-900/30
```

### Text
```
Dark Text → Light Text
text-slate-900 → dark:text-white
text-slate-600 → dark:text-slate-300
text-slate-500 → dark:text-slate-400
text-slate-400 → dark:text-slate-500
```

### Borders
```
Light Borders → Dark Borders
border-slate-200 → dark:border-slate-700
border-slate-100 → dark:border-slate-800
```

### Shadows
```
Light Shadow → Dark Shadow
shadow → dark:shadow-md
shadow-lg → dark:shadow-blue-900/20
```

## Interactive Elements

### Buttons
```jsx
// Primary Button
<button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
  Button
</button>

// Secondary Button
<button className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition">
  Secondary
</button>

// Danger Button
<button className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
  Delete
</button>
```

### Form Inputs
```jsx
<input
  type="text"
  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
  placeholder="Placeholder text"
/>
```

### Status Badges
```jsx
// Success
<span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded text-sm font-semibold">
  Success
</span>

// Warning
<span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded text-sm font-semibold">
  Warning
</span>

// Error
<span className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded text-sm font-semibold">
  Error
</span>
```

## Modals & Dialogs

```jsx
<div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center">
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 max-w-md">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
      Modal Title
    </h2>
    <p className="text-slate-600 dark:text-slate-400 mb-6">
      Modal content goes here.
    </p>
    <div className="flex gap-3">
      <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition">
        Cancel
      </button>
      <button className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
        Confirm
      </button>
    </div>
  </div>
</div>
```

## Tables

```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-slate-100 dark:bg-slate-700">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
          Column 1
        </th>
        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
          Column 2
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <td className="px-4 py-3 text-slate-900 dark:text-white">Data</td>
        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">More data</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Dropdown/Select

```jsx
<select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none">
  <option>Select an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## Toast/Notification

```jsx
// Success Toast
<div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 text-green-800 dark:text-green-300">
  ✓ Success message
</div>

// Error Toast
<div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-800 dark:text-red-300">
  ✗ Error message
</div>
```

## Best Practices Checklist

- [ ] All backgrounds have `dark:` variant
- [ ] All text colors have `dark:` variant
- [ ] All borders have `dark:` variant
- [ ] All hover states have `dark:` variant
- [ ] Form inputs have dark mode styling
- [ ] Sufficient contrast in dark mode (4.5:1 minimum)
- [ ] No hardcoded colors (use Tailwind only)
- [ ] Tested in both light and dark modes
- [ ] No color flashing on theme switch
- [ ] Theme preference persists on reload
