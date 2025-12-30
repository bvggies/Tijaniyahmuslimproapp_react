# Tijaniyah Admin Dashboard

A production-ready admin dashboard for **Tijaniyah Muslim Pro** built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Glass UI** - Beautiful glass morphism design with Islamic green theme
- **Dark/Light Mode** - Full theme support
- **Role-Based Access** - ADMIN, MODERATOR, SCHOLAR, SUPPORT, VIEWER roles
- **Real-time Data** - TanStack Query for efficient data fetching
- **Form Validation** - React Hook Form + Zod
- **Charts** - Recharts for analytics visualization

### Modules

- 📊 **Dashboard** - KPI cards, charts, activity feed
- 👥 **User Management** - Search, filter, role changes, status toggle
- 📅 **Event Management** - CRUD with image upload, publish/draft
- 💬 **Posts & Moderation** - Content moderation, reports queue
- 👨‍🎓 **Scholars & Lessons** - Scholar verification, lesson management
- 🔔 **Notifications** - Push notification campaigns
- 💰 **Donations** - Donation tracking, export
- 📰 **News** - Article management
- ⚙️ **Settings** - System status, audit logs, roles

## 🛠️ Tech Stack

- React 18 + TypeScript
- Tailwind CSS v3
- TanStack Query (React Query)
- TanStack Table
- React Hook Form + Zod
- Recharts
- Radix UI (shadcn-style)
- Zustand (state management)
- Axios (API client)
- lucide-react (icons)

## 📦 Installation

```bash
cd admin
npm install
```

## 🔧 Configuration

Create a `.env.local` file:

```env
REACT_APP_API_BASE_URL=https://tijaniyahmuslimproapp-backend.vercel.app
```

## 🏃 Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

## 🏗️ Production Build

```bash
npm run build
```

Outputs to `build/` folder.

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Set root directory: `admin`
4. Set environment variables:
   - `REACT_APP_API_BASE_URL`: Your backend API URL
5. Deploy!

Or use CLI:

```bash
cd admin
vercel
```

## 📁 Project Structure

```
admin/
├── src/
│   ├── app/                 # App setup (providers, router)
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── layout/          # Layout components (Sidebar, Topbar)
│   ├── features/            # Feature modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── events/
│   │   ├── posts/
│   │   ├── scholars/
│   │   ├── notifications/
│   │   ├── donations/
│   │   ├── content/
│   │   ├── news/
│   │   └── settings/
│   ├── lib/
│   │   ├── api/             # API client & types
│   │   ├── auth/            # Auth store
│   │   └── utils/           # Utility functions
│   └── index.css            # Tailwind + custom styles
├── tailwind.config.js
├── vercel.json
└── package.json
```

## 🎨 Theme Colors

```
Primary (Islamic Green):
#d8f3dc #b7e4c7 #95d5b2 #74c69d #52b788 #40916c #2d6a4f #1b4332 #081c15

Gold Accent:
#fef9c3 #fde047 #facc15 #eab308
```

## 🔐 Authentication

The dashboard uses JWT authentication. Tokens are stored in localStorage.

Demo credentials (if seeded):
- Email: `admin@tijaniyahpro.com`
- Password: `admin123`

## 📊 API Connection

The dashboard connects to the Tijaniyah backend API at:
- Production: `https://tijaniyahmuslimproapp-backend.vercel.app`

All API endpoints are typed in `src/lib/api/`.

## 🧪 Demo Mode

When the API is unavailable, the dashboard falls back to mock data for demonstration purposes. A yellow banner indicates demo mode.

---

Built with ❤️ for the Tijaniyah Muslim community.
