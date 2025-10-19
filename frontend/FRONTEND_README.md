# Comics Tracker Frontend

Angular 20 frontend application for the Comics Tracker project.

## Features

- ✅ Angular 20.3.6
- ✅ Server-Side Rendering (SSR) enabled
- ✅ SCSS styling
- ✅ HttpClient configured with interceptors
- ✅ JWT authentication setup
- ✅ Proxy configuration for API calls
- ✅ Environment configuration

## Project Structure

```
src/
├── app/
│   ├── components/         # Reusable UI components
│   ├── guards/            # Route guards (e.g., auth guard)
│   ├── interceptors/      # HTTP interceptors (e.g., auth interceptor)
│   ├── models/            # TypeScript interfaces and types
│   ├── services/          # API services
│   ├── app.config.ts      # App configuration with providers
│   ├── app.routes.ts      # Application routes
│   ├── app.ts             # Root component
│   └── app.html           # Root template
├── environments/          # Environment configurations
│   ├── environment.ts             # Production config
│   └── environment.development.ts # Development config
├── main.ts               # Application entry point
└── styles.scss           # Global styles
```

## Development Setup

### Prerequisites

- Node.js (v20.19.0 or v22.12.0 or v24.0.0+)
- npm 8.0.0+

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### API Proxy

The application is configured to proxy API calls to the backend server running on `http://localhost:3000`.

All requests to `/api/*` will be forwarded to the backend automatically.

Configuration: `proxy.conf.json`

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

## Services

### AuthService

Handles user authentication:

- `login(credentials)` - Login with username/password
- `register(userData)` - Register new user
- `logout()` - Logout current user
- `isAuthenticated()` - Check if user is logged in
- `getToken()` - Get JWT token
- `currentUser$` - Observable of current user

### ComicService

Handles comic CRUD operations:

- `getComics(page, limit)` - Get all comics with pagination
- `getComicById(id)` - Get single comic
- `createComic(comic)` - Create new comic
- `updateComic(id, comic)` - Update existing comic
- `deleteComic(id)` - Delete comic
- `searchComics(query)` - Search comics by title

## Guards

### authGuard

Protects routes that require authentication. Redirects to login if not authenticated.

Usage in routes:

```typescript
{
  path: 'comics',
  component: ComicsComponent,
  canActivate: [authGuard]
}
```

## Interceptors

### authInterceptor

Automatically adds JWT token to all HTTP requests (except login/register).

## Environment Configuration

### Development (`environment.development.ts`)

```typescript
{
  production: false,
  apiUrl: 'http://localhost:3000/api'
}
```

### Production (`environment.ts`)

```typescript
{
  production: true,
  apiUrl: 'http://localhost:3000/api'
}
```

## Backend API Integration

The frontend is configured to work with the Comics Tracker API running on port 3000.

Make sure the backend is running before starting the frontend:

```bash
cd ../api
npm start
```

## Next Steps

1. Create login/register components
2. Create comics list component
3. Create comic detail component
4. Create comic form component
5. Add routing configuration
6. Implement error handling
7. Add loading states
8. Create additional services for publishers, universes, creators, etc.
9. Add authentication flow
10. Implement role-based access control

## Notes

- The app uses standalone components (no NgModules)
- Zone.js is enabled for change detection
- SSR is configured for better SEO and performance
- JWT tokens are stored in localStorage
