# LMS Kampus - Frontend

Next.js 14 + React + Tailwind CSS

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan API URL dan Supabase credentials

# Start development server
npm run dev
```

Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── (auth)/          # Auth pages (login, register)
├── (student)/       # Student dashboard
├── (instructor)/    # Instructor dashboard
├── (admin)/         # Admin panel
├── layout.js        # Root layout
├── page.js          # Landing page
└── globals.css      # Global styles

components/          # Reusable components
lib/                 # Utilities & API client
public/              # Static assets
```

## Features

- Server-side rendering (SSR)
- Client-side routing
- API integration dengan React Query
- Authentication dengan JWT
- Responsive design (mobile-first)
- Dark mode support
- Real-time updates dengan Socket.io

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- React Query - Server state
- Zustand - Client state
- React Hook Form - Forms
- Zod - Validation
- Axios - HTTP client
- Socket.io Client - Real-time

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

See `DEPLOYMENT.md` for detailed instructions.
