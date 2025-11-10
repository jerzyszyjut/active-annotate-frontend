# Quick Start Guide

## Getting the Frontend Running in 5 Minutes

### Step 1: Prerequisites

```bash
# Check Node.js version (needs 18+)
node --version

# Install pnpm if you don't have it
npm install -g pnpm
```

### Step 2: Clone and Install

```bash
cd active-annotate-frontend
pnpm install
```

### Step 3: Configure Backend URL

Create `.env.local`:

```bash
echo 'VITE_API_URL=http://localhost:8000' > .env.local
```

### Step 4: Start Development Server

```bash
pnpm dev
```

Open `http://localhost:5173` in your browser.

## Typical Workflow

### 1. Start Backend

```bash
cd ../active-annotate
# Follow backend setup instructions
docker-compose -f docker-compose.local.yml up
```

### 2. Start Frontend

```bash
cd ../active-annotate-frontend
pnpm dev
```

### 3. Create Test Data (from Django shell)

```bash
# In another terminal
cd ../active-annotate
python manage.py shell

# Create a dataset
from active_annotate.datasets.models import ClassificationDataset, ClassificationLabel, ClassificationDatapoint
dataset = ClassificationDataset.objects.create(
    name="Test Dataset",
    label_studio_url="http://label-studio:8080",
    label_studio_api_key="test-key",
    ml_backend_url="http://ml-backend:9090",
    batch_size=16
)

# Create labels
ClassificationLabel.objects.create(
    dataset=dataset,
    class_index=0,
    class_label="Cat"
)
ClassificationLabel.objects.create(
    dataset=dataset,
    class_index=1,
    class_label="Dog"
)

# Create a test datapoint
ClassificationDatapoint.objects.create(
    dataset=dataset,
    file="path/to/image.jpg",
    label=ClassificationLabel.objects.first()
)
```

### 4. Browse Frontend

- Open Dashboard: Shows your test dataset
- Click "View": Opens dataset details
- See datapoints: Click to view predictions

## Building for Production

```bash
pnpm build
pnpm preview  # Test build locally
```

Output in `dist/` folder - ready to deploy!

## What's Next?

### Explore the Codebase

- `src/pages/dashboard.tsx` - Main dashboard
- `src/pages/dataset.tsx` - Dataset details
- `src/lib/api.ts` - API client
- `src/components/` - Reusable components

### Customize

- Edit `FRONTEND_README.md` for features overview
- Edit `DEVELOPMENT.md` for architecture deep dive
- Modify `src/config/site.ts` for app settings

### Extend Features

- Add new pages in `src/pages/`
- Create components in `src/components/`
- Add API endpoints in `src/lib/api.ts`
- Define types in `src/types/index.ts`

## Troubleshooting

### "Cannot find module '@/...'"

- Check `tsconfig.json` has correct `baseUrl` and `paths`
- Restart dev server

### "API connection failed"

- Ensure backend is running on configured URL
- Check `.env.local` has correct `VITE_API_URL`
- Check browser console for specific error

### "Port 5173 already in use"

```bash
# Kill process or use different port
pnpm dev -- --port 3000
```

### "Build fails with TypeScript errors"

```bash
# Check all files
pnpm tsc --noEmit

# Fix any errors then retry
pnpm build
```

## Directory Structure

```
active-annotate-frontend/
├── public/                    # Static assets
├── src/
│   ├── pages/                # Page components
│   │   ├── dashboard.tsx     # Main view
│   │   └── dataset.tsx       # Detail view
│   ├── components/           # Reusable components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   ├── types/               # TypeScript types
│   ├── styles/              # Global CSS
│   ├── App.tsx              # Main component
│   ├── main.tsx             # Entry point
│   └── provider.tsx         # Context providers
├── .env.example             # Env template
├── vite.config.ts           # Build config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## Key Technologies

| Tech         | Purpose           |
| ------------ | ----------------- |
| React 18     | UI framework      |
| TypeScript   | Type safety       |
| Vite         | Fast build tool   |
| HeroUI       | Component library |
| Tailwind     | CSS framework     |
| Ky           | HTTP client       |
| React Router | Navigation        |

## API Endpoints Used

| Method | Endpoint                                  | Purpose        |
| ------ | ----------------------------------------- | -------------- |
| GET    | `/api/data/datasets/classification/`      | List datasets  |
| GET    | `/api/data/datasets/classification/{id}/` | Get dataset    |
| PATCH  | `/api/data/datasets/classification/{id}/` | Update dataset |

## Next Steps

1. **[Read FRONTEND_README.md](./FRONTEND_README.md)** - Full feature documentation
2. **[Read DEVELOPMENT.md](./DEVELOPMENT.md)** - Architecture deep dive
3. **[Explore backend API](../api.yaml)** - Backend endpoints
4. **[Check backend code](../active-annotate/)** - Django models

## Support

Need help?

1. Check error message in browser console
2. Review FRONTEND_README.md for features
3. Check DEVELOPMENT.md for architecture
4. Look at backend code for data structure
5. Check `.env.local` configuration

Happy coding! 🚀
