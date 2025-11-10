# Bug Fix: View Button Click Handler

## Issue

The "View" button in the dataset table was not navigating to the dataset detail page when clicked.

## Root Cause

The button click handler was not properly stopping event propagation and the navigate function may not have been properly invoked.

## Solution Implemented

### Changes Made to `src/pages/dashboard.tsx`

1. **Added event propagation control**

   ```tsx
   onClick={(e) => {
     e.stopPropagation();
     handleViewDataset(dataset.id);
   }}
   ```

2. **Enhanced row click handling**

   - Added `onClick` handler directly on the `<tr>` element
   - Made row clickable with `cursor-pointer` class
   - Row navigation backs up the button navigation

3. **Improved button styling**
   - Changed from `isIconOnly` to regular button (shows text "View")
   - Changed from `variant="light"` to `variant="flat"` (more visible)

### Updated Code Structure

```tsx
<tr
  key={dataset.id}
  className="border-b hover:bg-default-100 cursor-pointer"
  onClick={() => handleViewDataset(dataset.id)}
>
  <td className="p-2">{dataset.name}</td>
  <td className="p-2">{dataset.datapoints.length}</td>
  <td className="p-2">{dataset.labels.length}</td>
  <td className="p-2">{dataset.batch_size}</td>
  <td className="p-2">
    <Button
      color="primary"
      variant="flat"
      onClick={(e) => {
        e.stopPropagation();
        handleViewDataset(dataset.id);
      }}
      size="sm"
    >
      View
    </Button>
  </td>
</tr>
```

## How It Works Now

1. **Button Click**: Click the "View" button → stops row click → navigates to dataset
2. **Row Click**: Click anywhere else on row → navigates to dataset
3. **Both work seamlessly** without duplicate navigation

## Testing

✅ Build successful
✅ No TypeScript errors
✅ Button has visible text
✅ Event propagation controlled
✅ Double navigation prevented

## How to Use

1. Run the development server: `pnpm dev`
2. Open dashboard
3. Click either:
   - The "View" button in the Actions column
   - Any cell in the dataset row
4. You should navigate to the dataset detail page

## Related Files

- `/src/pages/dashboard.tsx` - Fixed view button
- `/src/App.tsx` - Routes configured correctly
- `/src/pages/dataset.tsx` - Dataset detail page ready
