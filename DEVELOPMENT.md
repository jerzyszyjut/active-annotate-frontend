# Frontend Development Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React App (Frontend)                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Pages (Dashboard, Dataset)                      │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Components (Modal, Navbar, SearchInput)        │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Hooks (useAsync)                               │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Client (lib/api.ts with Ky)               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           ↓ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│           Django Backend (active-annotate)              │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Dashboard Page Flow

```
DashboardPage (Load)
  ↓
useEffect → datasetsApi.list()
  ↓
Ky HTTP Request → GET /api/data/datasets/classification/
  ↓
Response parsed to ClassificationDataset[]
  ↓
setState(datasets)
  ↓
Render table with datasets
  ↓
User clicks "View"
  ↓
navigate("/dataset/:id")
```

### 2. Dataset Page Flow

```
DatasetPage (Load with id)
  ↓
useEffect → datasetsApi.get(id)
  ↓
Ky HTTP Request → GET /api/data/datasets/classification/{id}/
  ↓
Response with nested datapoints & labels
  ↓
setState(dataset)
  ↓
Render dataset info, datapoints list
  ↓
User clicks datapoint
  ↓
setSelectedDatapoint() → onOpen()
  ↓
DatapointModal renders with predictions grouped by version
```

## Data Models (TypeScript Interfaces)

### ClassificationDataset

```typescript
{
  id: number;
  name: string;
  label_studio_url: string;
  label_studio_api_key: string;
  ml_backend_url: string;
  batch_size: number;
  datapoints: ClassificationDatapoint[];
  labels: ClassificationLabel[];
}
```

### ClassificationDatapoint

```typescript
{
  id: number;
  file_url: string;
  predictions: ClassificationPrediction[];
  label: ClassificationLabel | null;
  dataset: number; // Foreign key to dataset
}
```

### ClassificationPrediction

```typescript
{
  id: number;
  predicted_label: ClassificationLabel;
  confidence: number | null;
  model_version: number;
  datapoint: number; // Foreign key to datapoint
}
```

### ClassificationLabel

```typescript
{
  id: number;
  class_index: number;
  class_label: string;
  dataset: number; // Foreign key to dataset
}
```

## Component Hierarchy

### Dashboard

- SearchInput (child)
- Table with view buttons

### Dataset

- Dataset info card (editable)
- Statistics cards
- Start Active Learning button
- Datapoints list (clickable rows)
- DatapointModal (conditional)
  - File preview
  - Current label
  - Predictions grouped by version

### DatapointModal

- File image preview
- Label badge
- Predictions by version
  - Confidence bars
  - Label display

## State Management Patterns

### Page-level State

```typescript
const [dataset, setDataset] = useState<ClassificationDataset | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Edit State

```typescript
const [isEditingInfo, setIsEditingInfo] = useState(false);
const [editedDataset, setEditedDataset] = useState<
  Partial<ClassificationDataset>
>({});
const [isSaving, setIsSaving] = useState(false);
```

### Modal State

```typescript
const { isOpen, onOpen, onClose } = useDisclosure();
const [selectedDatapoint, setSelectedDatapoint] =
  useState<ClassificationDatapoint | null>(null);
```

## API Error Handling

The API client includes automatic error handling:

```typescript
try {
  const data = await datasetsApi.list();
  setData(data);
} catch (err) {
  const errorMsg = handleApiError(err);
  setError(errorMsg);
}
```

Error types handled:

- HTTPError: API returned error status
- Network errors: Connection issues
- Timeout errors: Request exceeded 30s
- Parsing errors: Invalid JSON response

## Key Features Implementation

### 1. Dataset Search

```typescript
const filteredDatasets = useMemo(
  () =>
    datasets.filter((dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [datasets, searchTerm]
);
```

### 2. Predictions Grouping

```typescript
const predictionsByVersion = useMemo(() => {
  const grouped = new Map<number, ClassificationPrediction[]>();
  datapoint.predictions.forEach((pred) => {
    if (!grouped.has(pred.model_version)) {
      grouped.set(pred.model_version, []);
    }
    grouped.get(pred.model_version)!.push(pred);
  });
  return grouped;
}, [datapoint]);
```

### 3. Dataset Info Editing

```typescript
const handleSaveDatasetInfo = async () => {
  const updatedDataset = await datasetsApi.patch(datasetId, editedDataset);
  setDataset(updatedDataset);
  setIsEditingInfo(false);
};
```

## Styling Strategy

### Tailwind CSS Classes Used

- Layout: `flex`, `grid`, `container`, `mx-auto`
- Spacing: `p-4`, `gap-4`, `mb-6`
- Colors: `bg-default-100`, `text-default-500`, `text-success-700`
- States: `hover:bg-default-100`, `hover:opacity-80`
- Responsive: `hidden lg:flex`, `sm:hidden`

### HeroUI Component Classes

- Cards: `Card`, `CardHeader`, `CardBody`
- Inputs: `Input`, `Button`
- Modals: `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`
- Navigation: `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`

## Best Practices Applied

### 1. Component Composition

- Single responsibility principle
- Props drilling minimized
- Reusable components (SearchInput, DatapointModal)

### 2. Performance

- Memoization with `useMemo` for filtered lists
- `useCallback` for event handlers
- Conditional rendering to avoid unnecessary renders
- Virtual scrolling ready (grid with max-h)

### 3. Error Handling

- User-friendly error messages
- Retry buttons
- Error boundaries ready
- Network resilience

### 4. Type Safety

- Full TypeScript coverage
- No `any` types
- Strict null checks
- Interface definitions for all data

### 5. API Integration

- Centralized API client in `lib/api.ts`
- Environment-based configuration
- Request/response interceptors ready
- Error standardization

## Adding New Features

### 1. New API Endpoint

```typescript
// In lib/api.ts
export const newApi = {
  list: () => api.get("new-endpoint/").json<NewType[]>(),
  get: (id: number) => api.get(`new-endpoint/${id}/`).json<NewType>(),
};
```

### 2. New Page

```typescript
// In pages/new.tsx
export default function NewPage() {
  const [state, setState] = useState<Type | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await newApi.list();
      setState(data);
    };
    fetch();
  }, []);

  return <div>{/* UI */}</div>;
}

// In App.tsx
<Route element={<NewPage />} path="/new" />
```

### 3. New Component

```typescript
// In components/new-component.tsx
interface NewComponentProps {
  prop1: string;
  onAction: (value: string) => void;
}

export function NewComponent({ prop1, onAction }: NewComponentProps) {
  return <div>{prop1}</div>;
}
```

## Testing Strategy

### Unit Testing

- Component prop validation
- Utility functions (API client, hooks)

### Integration Testing

- Page data flows
- API interactions
- Navigation

### E2E Testing

- Dashboard workflow
- Dataset details workflow
- Modal interactions

## Performance Metrics to Monitor

- Initial load time (target: < 2s)
- API response time (target: < 500ms)
- Component re-render frequency
- Memory usage with large datasets
- Search filter performance

## Common Issues & Solutions

### Issue: API returns 404 for nested resources

**Solution**: Check API_BASE_URL environment variable and endpoint path

### Issue: Modal doesn't show predictions

**Solution**: Verify datapoint.predictions array is populated from API

### Issue: Search is slow with large datasets

**Solution**: Consider debouncing the search input or virtualized list

### Issue: Types don't match API response

**Solution**: Update interfaces in `types/index.ts` to match backend serializers

## Security Considerations

- ✅ API key hashed/hidden in UI (display as dots)
- ✅ No secrets in client-side code
- ✅ HTTPS ready (environment configurable)
- ✅ CORS handled by backend
- ✅ Input validation before API calls

## Deployment

### Build

```bash
pnpm build
# Output in dist/
```

### Environment Variables

Set `VITE_API_URL` to production backend URL

### Hosting

- Vercel: Zero-config deployment
- Netlify: Drag-and-drop or Git integration
- Static hosting (S3, Cloudflare): Works with `dist/` folder

## Troubleshooting

### Development

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm tsc --noEmit

# Lint and fix
pnpm lint
```

### Production

- Check browser DevTools console for errors
- Verify API_URL is correct in production environment
- Check Network tab for failed requests
- Verify CORS headers from backend

## Resources

- [HeroUI Documentation](https://heroui.com/docs/guide/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ky HTTP Client](https://github.com/sindresorhus/ky)
