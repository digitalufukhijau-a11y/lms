# Migration to Supabase-First Architecture

## 🎯 Arsitektur Baru

```
Next.js 14 (Vercel) - Single Application
└── Supabase (All-in-one Backend)
    ├── Database (PostgreSQL + PgBouncer)
    ├── Auth (JWT + OAuth + RLS)
    ├── Realtime (WebSocket built-in)
    └── Storage (PDF, images, documents)

External Services (Optional):
├── Cloudflare Stream → Video streaming
├── LiveKit Cloud → Live class
└── Resend → Email notifications
```

## ✅ Yang Sudah Dihapus

1. ❌ **Entire `backend/` folder** - Tidak perlu Express.js terpisah
2. ❌ **Docker & Docker Compose** - Tidak perlu container
3. ❌ **Redis** - Diganti Supabase Realtime
4. ❌ **Socket.io** - Diganti Supabase Realtime
5. ❌ **JWT manual** - Diganti Supabase Auth
6. ❌ **Prisma** - Diganti Supabase Client (bisa tetap pakai kalau mau)
7. ❌ **Custom middleware** - Diganti Supabase RLS
8. ❌ **Railway/Render deployment** - Cukup Vercel

## ✅ Yang Sudah Dibuat

### 1. Supabase Integration
- ✅ `lib/supabase/client.js` - Browser client
- ✅ `lib/supabase/server.js` - Server component client
- ✅ `lib/supabase/middleware.js` - Auth middleware
- ✅ `middleware.js` - Next.js middleware untuk auth

### 2. Database Schema
- ✅ `supabase/migrations/20260319000000_initial_schema.sql` - Complete schema
- ✅ `supabase/migrations/20260319000001_rls_policies.sql` - Row Level Security

### 3. Updated Files
- ✅ `frontend/package.json` - Dependencies updated
- ✅ `.env.example` - Simplified environment variables
- ✅ `frontend/.env.example` - Frontend env vars
- ✅ `frontend/app/(auth)/login/page.js` - Using Supabase Auth

## 🚧 Yang Perlu Diselesaikan

### Auth Pages
- [ ] Update `register/page.js` untuk Supabase Auth
- [ ] Buat trigger untuk auto-create profile setelah signup
- [ ] Setup email templates di Supabase

### Dashboard Pages
- [ ] Update `student/page.js` untuk fetch dari Supabase
- [ ] Update `instructor/page.js` untuk fetch dari Supabase
- [ ] Buat `admin/page.js`

### API Routes (Next.js)
- [ ] `/api/courses` - CRUD courses
- [ ] `/api/enrollments` - Enroll management
- [ ] `/api/progress` - Progress tracking
- [ ] `/api/quizzes` - Quiz management
- [ ] `/api/certificates` - Generate certificates (jsPDF)
- [ ] `/api/upload` - Upload to Supabase Storage

### Components
- [ ] Course card component
- [ ] Video player component
- [ ] Quiz component
- [ ] Progress tracker component
- [ ] Certificate viewer component

### Realtime Features
- [ ] Subscribe to notifications
- [ ] Live progress updates
- [ ] Real-time quiz results

## 📦 Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Setup Supabase Project
1. Buat project di https://supabase.com
2. Copy Project URL dan Anon Key
3. Paste ke `.env.local`

### 3. Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 4. Setup Auth Trigger
Jalankan di Supabase SQL Editor:
```sql
-- Auto-create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Start Development
```bash
npm run dev
```

## 🎨 Benefits

### Sebelum (8 Services):
1. Next.js Frontend
2. Express Backend
3. PostgreSQL (Neon)
4. Redis (Upstash)
5. Storage (Cloudflare R2)
6. Auth (JWT manual)
7. Realtime (Socket.io)
8. Email (Resend)

### Sesudah (4 Services):
1. **Next.js + Supabase** (Database + Auth + Realtime + Storage)
2. Cloudflare Stream (video only)
3. LiveKit (live class only)
4. Resend (email only)

### Keuntungan:
- ✅ **50% lebih sedikit services** - Dari 8 jadi 4
- ✅ **Satu dashboard** - Semua di Supabase
- ✅ **Built-in security** - RLS policies
- ✅ **Auto-scaling** - PgBouncer included
- ✅ **Real-time gratis** - WebSocket built-in
- ✅ **Deployment simple** - Cukup Vercel
- ✅ **Cost effective** - Free tier generous

## 💰 Cost Comparison

### Sebelum:
- Neon: $0-25/mo
- Upstash: $0-10/mo
- Cloudflare R2: $0-15/mo
- Railway: $5-20/mo
- Vercel: $0-20/mo
**Total: $5-90/mo**

### Sesudah:
- Supabase: $0-25/mo (includes DB + Auth + Storage + Realtime)
- Cloudflare Stream: Pay per use
- LiveKit: Pay per use
- Vercel: $0-20/mo
**Total: $0-45/mo** (50% cheaper!)

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🔄 Next Steps

1. Selesaikan auth pages (register)
2. Buat API routes untuk CRUD operations
3. Update dashboard pages
4. Implement realtime features
5. Setup Cloudflare Stream untuk video
6. Setup LiveKit untuk live class
7. Testing & deployment

## ⚠️ Breaking Changes

- Tidak ada lagi `backend/` folder
- Tidak ada lagi Docker
- Tidak ada lagi manual JWT
- Auth sekarang pakai Supabase Auth
- Storage sekarang pakai Supabase Storage
- Realtime sekarang pakai Supabase Realtime

## 🎉 Result

Project sekarang jauh lebih simple, scalable, dan cost-effective!
