# ⚡ Nexus — Service Provider Frontend

A **production-ready** React frontend for a professional services platform. Built with Vite, Tailwind CSS, Framer Motion, TanStack Query, and Zustand.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/         # Navbar, Footer
│   └── ui/             # Avatar, Button, FormField, Modal, Skeleton, Pagination…
├── hooks/              # useDebounce, useLogout, useMediaQuery, useScrollTop…
├── layouts/            # AuthLayout, PublicLayout, DashboardLayout
├── pages/
│   ├── auth/           # Login, Signup, Forgot/Reset Password, Verify Email/OTP
│   ├── user/           # Dashboard, Profile, ChangePassword
│   ├── admin/          # Dashboard, Users, Contacts, Services, ServiceForm
│   └── services/       # ServicesPage, ServiceDetail
├── routes/             # Lazy-loaded routes with ProtectedRoute + GuestRoute guards
├── services/api/       # Axios client with token refresh + all API modules
├── store/              # Zustand auth store (with persistence)
└── utils/              # cn(), formatDate, timeAgo, getErrorMessage, debounce…
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:5000`

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_RECAPTCHA_SITE_KEY=your_key_here   # optional in dev
```

### 3. Start development server

```bash
npm run dev
# → http://localhost:3000
```

### 4. Build for production

```bash
npm run build
npm run preview    # preview the production build
```

---

## ✅ Feature Checklist

| Feature | Status |
|---------|--------|
| Signup with password strength meter | ✅ |
| Login with brute-force error feedback | ✅ |
| OTP verification (6-digit input + paste) | ✅ |
| Email verification page | ✅ |
| Forgot / Reset password flow | ✅ |
| JWT access + refresh token rotation | ✅ |
| Silent token refresh queue (Axios) | ✅ |
| Persistent auth (Zustand + localStorage) | ✅ |
| Protected routes (user + admin) | ✅ |
| Guest-only routes (auto-redirect if logged in) | ✅ |
| User dashboard with verification status | ✅ |
| Profile page with avatar upload | ✅ |
| Change password (invalidates all sessions) | ✅ |
| Account deactivation | ✅ |
| Service listing with search + filter + pagination | ✅ |
| Service detail with image carousel | ✅ |
| Contact form with success state | ✅ |
| Admin dashboard with live stats + mini chart | ✅ |
| Admin user management (edit role, verify, deactivate) | ✅ |
| Admin contact inbox (status workflow, reply) | ✅ |
| Admin service CRUD (create, edit, toggle, delete) | ✅ |
| Image upload via Cloudinary | ✅ |
| Loading skeletons (cards, list, stats) | ✅ |
| Toast notifications | ✅ |
| Error boundary with fallback UI | ✅ |
| 404 page | ✅ |
| Fully responsive (mobile + desktop) | ✅ |
| Framer Motion animations throughout | ✅ |
| Debounced search | ✅ |
| React Query caching (5 min stale time) | ✅ |
| Lazy-loaded routes (code splitting) | ✅ |

---

## 🗺️ Route Map

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Homepage |
| `/services` | Public | Services listing |
| `/services/:slug` | Public | Service detail |
| `/contact` | Public | Contact form |
| `/auth/login` | Guest only | Login |
| `/auth/signup` | Guest only | Registration |
| `/auth/forgot-password` | Guest only | Forgot password |
| `/auth/reset-password` | Guest only | Reset password |
| `/auth/verify-email` | Public | Email verification |
| `/auth/verify-otp` | Public | Phone OTP |
| `/dashboard` | User | Overview |
| `/dashboard/profile` | User | Profile + avatar |
| `/dashboard/change-password` | User | Security |
| `/admin` | Admin | Dashboard + stats |
| `/admin/services` | Admin | Services CRUD |
| `/admin/services/new` | Admin | Create service |
| `/admin/services/:id/edit` | Admin | Edit service |
| `/admin/users` | Admin | User management |
| `/admin/contacts` | Admin | Contact inbox |

---

## 🔐 Auth Flow

```
User signs up → Email verification sent + OTP sent
↓
User verifies email (link) + verifies OTP (6-digit)
↓
Login → gets accessToken (15m) + refreshToken (7d)
↓
Axios interceptor silently refreshes expired accessToken
↓
On refresh failure → clear auth + redirect to /auth/login
```

---

## 🎨 Design System

The design uses a custom Tailwind configuration with:

- **Fonts**: Playfair Display (headings) + DM Sans (body) + JetBrains Mono (code)
- **Colors**: Deep slate-indigo primary + warm gold accent
- **Components**: `.btn-primary`, `.btn-secondary`, `.card`, `.card-hover`, `.form-input`, `.badge-*`, `.skeleton`, `.glass`
- **Animations**: `animate-shimmer` (skeleton), `animate-float`, `animate-fade-in`, `animate-slide-up`

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state & caching |
| `zustand` | Client auth state |
| `axios` | HTTP client + interceptors |
| `react-hook-form` | Form state management |
| `zod` | Schema validation |
| `framer-motion` | Page & component animations |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icon library |
| `react-error-boundary` | Error boundaries |
| `react-intersection-observer` | Scroll-triggered animations |
| `clsx` + `tailwind-merge` | Safe class merging |

---

## 🚀 Production Deployment

### Netlify / Vercel (Recommended)

```bash
# Build command:
npm run build

# Output directory:
dist

# Environment variables: set in dashboard
VITE_API_URL=https://your-api.com/api/v1
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```nginx
# nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  location /api { proxy_pass http://api:5000; }
}
```

---

*Frontend built to production standards — scalable, secure, and fast.*
