# Configuration Reference

## Environment Variables

### Development

Create `.env.local` in project root:

```env
VITE_API_URL=http://localhost:8000
```

### Production

Set environment variable before build:

```bash
export VITE_API_URL=https://api.example.com
pnpm build
```

### Environment Files Priority

1. `.env.local` - Local overrides (gitignored)
2. `.env.production.local` - Production local (gitignored)
3. `.env.production` - Production defaults
4. `.env.development.local` - Development local (gitignored)
5. `.env.development` - Development defaults
6. `.env` - General defaults

## Configuration Files

### `vite.config.ts`

Vite build configuration:

- Entry point: `src/main.tsx`
- Build output: `dist/`
- Dev server: Port 5173
- HMR enabled for fast updates

### `tsconfig.json`

TypeScript configuration:

- Target: ES2020
- Strict mode: enabled
- JSX: react-jsx
- Module resolution: bundler
- Path aliases: `@/` → `src/`

### `tailwind.config.js`

Tailwind CSS configuration:

- Content: `src/**/*.{js,jsx,ts,tsx}`
- Theme: Extended with Tailwind defaults
- HeroUI integration: Automatic

### `postcss.config.js`

PostCSS configuration:

- Tailwind CSS plugin
- Tailwind v4 support

### `eslint.config.mjs`

ESLint configuration:

- TypeScript support
- React rules
- Import ordering
- Prettier integration

## API Configuration

### Base URL

Default: `http://localhost:8000`

Override with:

```env
VITE_API_URL=https://your-api.com
```

### Timeout

Default: 30 seconds

Change in `src/lib/api.ts`:

```typescript
const api = ky.create({
  timeout: 60000, // 60 seconds
});
```

### Retry Policy

Default: 1 retry on failure

Change in `src/lib/api.ts`:

```typescript
const api = ky.create({
  retry: 3, // 3 retries
});
```

## Build Configuration

### Development Build

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
```

Output: `dist/` folder

### Preview Build

```bash
pnpm preview
```

Test production build locally

## Performance Configuration

### Code Splitting

Automatic in Vite:

- Main bundle
- Vendor bundle
- Component bundles

### CSS Optimization

Tailwind CSS purging:

- Only used classes included
- Automatic in production build

### Image Optimization

Manual optimization:

- Place in `public/` for static
- Reference as `/image.png`
- HeroUI components optimize automatically

## Security Configuration

### CORS

Handled by backend:

- Frontend must be allowed in Django settings
- Credentials sent automatically

### API Keys

Environment variable based:

- Never commit `.env.local`
- Use `.env.example` template
- Rotate keys in production

### Headers

Automatic with Ky:

- Content-Type: application/json
- Accept: application/json

## Theme Configuration

### Dark/Light Mode

Toggle via theme-switch component:

- Stored in localStorage
- Applied to entire app
- HeroUI handles automatically

### Tailwind Dark Mode

Uses class strategy:

```html
<html class="dark">
  <!-- dark theme applied -->
</html>
```

## Component Configuration

### HeroUI Components

Imported individually:

```typescript
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
```

### Tailwind CSS

Global styles in `src/styles/globals.css`:

- Base styles
- Custom utilities
- Component defaults

## Routing Configuration

### Routes

Defined in `src/App.tsx`:

```typescript
<Route element={<DashboardPage />} path="/" />
<Route element={<DatasetPage />} path="/dataset/:id" />
```

### Navigation

React Router with useNavigate:

```typescript
const navigate = useNavigate();
navigate("/dataset/123");
```

### Link Handler

HeroUI Link with router integration in `src/provider.tsx`

## Logging Configuration

### Development

Console logging enabled:

- API requests in network tab
- Component renders in React DevTools
- Errors in console

### Production

Error tracking ready:

- Add Sentry integration
- Add error boundary
- Log to service

## Build Optimization

### Tree Shaking

Enabled by default in Vite:

- Unused code removed
- Only imported functions included

### Lazy Loading

Ready to implement:

```typescript
import { lazy } from "react";
const DashboardPage = lazy(() => import("./pages/dashboard"));
```

### Minification

Automatic in production:

- JavaScript minified
- CSS minified
- HTML minified

## Development Tools

### TypeScript

Type checking:

```bash
pnpm tsc --noEmit
```

### ESLint

Code quality:

```bash
pnpm lint
pnpm lint --fix
```

### Vite Dev Tools

- Automatic HMR
- Fast refresh
- Module graph
- Build analysis

## Performance Metrics

### Bundle Sizes

Target: < 100 KB gzipped
Current: 53.25 KB

### First Paint

Target: < 1s
Current: Depends on network

### Time to Interactive

Target: < 2s
Current: Depends on API

## Testing Configuration

### Vitest Ready

Setup in `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
```

### React Testing Library

Ready to import:

```typescript
import { render, screen } from "@testing-library/react";
```

## CI/CD Configuration

### GitHub Actions

Example workflow:

```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm lint
```

### Vercel

Auto-deploy from Git:

- Environment variables configured
- Build command: `pnpm build`
- Output directory: `dist`

## Database Configuration

### API-Based

No local database:

- All data from backend API
- Real-time sync via HTTP
- Ready for WebSocket upgrades

## Cache Configuration

### HTTP Cache

Browser caching:

- Static assets: 1 year
- API: No cache (dynamic)

### Service Workers

Ready for PWA:

- Install service worker
- Add offline support
- Cache strategies

## Monitoring Configuration

### Error Tracking

Ready for integration:

- Sentry setup example
- Custom error handler
- Error boundaries

### Analytics

Ready for integration:

- Google Analytics
- Mixpanel
- Custom tracking

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] No console errors/warnings
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] API URL correct for environment
- [ ] CORS enabled on backend
- [ ] Assets optimized
- [ ] Security headers set
- [ ] Error tracking configured
- [ ] Monitoring enabled

## Troubleshooting Configuration

### Port Already in Use

```bash
pnpm dev -- --port 3000
```

### API Connection Failed

Check:

1. `.env.local` has correct URL
2. Backend is running
3. CORS enabled on backend
4. Firewall allows connection

### Build Fails

```bash
# Clear cache
rm -rf dist node_modules/.vite
pnpm build
```

### TypeScript Errors

```bash
pnpm tsc --noEmit
# Fix errors then rebuild
```

## Performance Tuning

### Vite Config

Optimize in `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    target: "ES2020",
    minify: "terser",
    sourcemap: false, // disable for production
  },
});
```

### Tailwind Config

Optimize in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Only scan necessary files
};
```

---

**Last Updated**: November 10, 2025

For questions, check DEVELOPMENT.md or FRONTEND_README.md
