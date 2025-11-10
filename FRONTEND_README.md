# Active Annotate Frontend

A modern React/TypeScript frontend for managing machine learning active learning loops with classification datasets.

## Features

✨ **Core Features**

- Dashboard view with dataset listing and search
- Dataset management with editable configuration
- Datapoint browser with predictions grouped by model version
- Real-time data fetching with error handling
- Dark/Light theme support

🎯 **Best Practices Implemented**

- Type-safe TypeScript interfaces for all API models
- Modular component architecture
- Custom hooks for data fetching (`useAsync`)
- Responsive design with HeroUI components
- Environment configuration support
- Comprehensive error handling

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **HeroUI** - Component library
- **Tailwind CSS** - Styling
- **Ky** - HTTP client (lightweight alternative to axios)
- **React Router** - Navigation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── datapoint-modal.tsx    # Modal for viewing datapoint details
│   ├── navbar.tsx             # Navigation bar
│   ├── search-input.tsx       # Search input component
│   ├── theme-switch.tsx       # Dark/Light theme toggle
│   └── icons.tsx              # Icon components
├── hooks/              # Custom React hooks
│   └── use-async.ts    # Generic async data fetching hook
├── lib/                # Utilities and API client
│   └── api.ts          # API endpoints with ky
├── pages/              # Page components
│   ├── dashboard.tsx   # Main dashboard with dataset list
│   └── dataset.tsx     # Dataset detail view
├── types/              # TypeScript interfaces
│   └── index.ts        # API model types
├── layouts/            # Layout components
├── styles/             # Global styles
└── config/             # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

```bash
cd active-annotate-frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your backend API URL
```

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## API Configuration

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

The frontend expects the backend API to be running on the configured URL. The API client automatically handles:

- Request/response serialization
- Error handling
- Timeouts (30 seconds)
- Retry logic (1 attempt)

## Usage

### Dashboard

- View all classification datasets
- Search datasets by name
- View dataset statistics
- Click "View" to navigate to dataset details

### Dataset View

- **Info Section**: View and edit dataset configuration
  - Name, Label Studio URL, ML Backend URL
  - API keys are hidden in display mode
  - Batch size configuration
- **Statistics**: See labeled/unlabeled datapoint counts
- **Datapoints List**: Browse all datapoints
  - Shows label status (Labeled/Unlabeled)
  - Click to view predictions in modal

### Datapoint Modal

- **File Preview**: View the datapoint image/file
- **Current Label**: See the assigned label if any
- **Predictions**: Grouped by model version
  - Confidence scores with visual progress bars
  - Latest model versions first
  - Organized by prediction grouping

## API Integration

The frontend communicates with the Django backend. Key endpoints:

```
GET    /api/data/datasets/classification/        # List datasets
GET    /api/data/datasets/classification/{id}/   # Get dataset
PATCH  /api/data/datasets/classification/{id}/   # Update dataset
GET    /api/data/datapoints/classification/      # List datapoints
GET    /api/data/datapoints/classification/{id}/ # Get datapoint
```

## Error Handling

The application includes:

- User-friendly error messages
- Automatic error recovery UI
- Request retry functionality
- Type-safe error handling with HTTPError detection

## Customization

### Adding New Pages

1. Create a new file in `src/pages/`:

```tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

2. Add route in `src/App.tsx`:

```tsx
<Route element={<NewPage />} path="/new" />
```

3. Add navigation link in `src/components/navbar.tsx`

### Styling

- Uses Tailwind CSS for styling
- HeroUI components provide consistent theming
- Dark/Light mode support via `theme-switch` component
- Custom styles in `src/styles/globals.css`

## Performance Optimizations

- ✅ Memoized computations with `useMemo`
- ✅ Optimized re-renders with `useCallback`
- ✅ Lazy route loading ready
- ✅ Image optimization in modals
- ✅ Search debouncing via input state

## Future Enhancements

- [ ] Implement "Start Active Learning" endpoint integration
- [ ] Add data export functionality (CSV, JSON)
- [ ] Batch operations for datapoints
- [ ] Label annotations interface
- [ ] Model performance metrics dashboard
- [ ] Advanced filtering and sorting
- [ ] Real-time updates with WebSockets
- [ ] User authentication and permissions

## Development

### Building for Production

```bash
pnpm build
pnpm preview
```

### Linting

```bash
pnpm lint
```

### Project Setup with Vite Config

The project uses:

- Vite for fast HMR and optimized builds
- TailwindCSS with Vite plugin
- PostCSS for CSS processing
- TypeScript strict mode

## Environment Variables

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires ES2020+ support

## Contributing

When adding new features:

1. Keep components small and focused
2. Add TypeScript types for all props
3. Use existing UI components from HeroUI
4. Test with different dataset sizes
5. Ensure responsive design

## License

See LICENSE file in the root directory.

## Related Projects

- [active-annotate](../active-annotate/) - Django backend
- [Label Studio](https://labelstud.io/) - Annotation platform
- [HeroUI](https://heroui.com/) - Component library

## Support

For issues or questions about the frontend:

1. Check the [API documentation](../api.yaml)
2. Review component prop types in TypeScript
3. Check browser console for error details
