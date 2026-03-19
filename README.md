# LMS Kampus - Learning Management System

<div align="center">

![LMS Kampus](https://img.shields.io/badge/LMS-Kampus-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**Sistem Manajemen Pembelajaran Modern - Powered by Supabase**

[Demo](https://lms-kampus.vercel.app) · [Dokumentasi](./SETUP.md) · [Report Bug](https://github.com/yourusername/lms-kampus/issues)

</div>

---

## 📚 Tentang Project

LMS Kampus adalah platform pembelajaran digital yang dibangun dengan arsitektur modern **Supabase-first**. Dirancang untuk institusi kampus dan sekolah dengan fokus pada kesederhanaan, skalabilitas, dan efisiensi biaya.

### ✨ Fitur Utama

- 🎓 **Manajemen Kursus** - Struktur hierarki (Course → Chapter → Lesson)
- 📹 **Multi-format Content** - Video, PDF, Text, Quiz
- ✅ **Quiz & Ujian Online** - Auto-grading, timer, anti-cheating
- 📊 **Progress Tracking** - Real-time monitoring kemajuan belajar
- 🎥 **Live Class** - Video conference terintegrasi (LiveKit)
- 📜 **Sertifikat Digital** - Auto-generate PDF setelah lulus
- 🔔 **Notifikasi Real-time** - Supabase Realtime WebSocket
- 👥 **Multi-role** - Student, Instructor, Admin dengan RLS
- 📱 **Responsive** - Mobile-first design
- 🔒 **Secure** - Row Level Security (RLS) built-in

## 🚀 Tech Stack (Ultra Simple!)

```
Next.js 14 (Vercel)
└── Supabase (All-in-one)
    ├── PostgreSQL + PgBouncer
    ├── Auth (JWT + OAuth)
    ├── Realtime (WebSocket)
    └── Storage (Files)

Optional:
├── Cloudflare Stream (video)
├── LiveKit Cloud (live class)
└── Resend (email)
```

### Kenapa Supabase-First?

✅ **4 services** instead of 8  
✅ **Satu dashboard** untuk semua  
✅ **Built-in security** dengan RLS  
✅ **Auto-scaling** PgBouncer included  
✅ **Real-time gratis** WebSocket built-in  
✅ **50% lebih murah** dari arsitektur sebelumnya  

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (gratis di [supabase.com](https://supabase.com))

### 5-Minute Setup

```bash
# 1. Clone & install
git clone https://github.com/yourusername/lms-kampus.git
cd lms-kampus/frontend
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials

# 3. Setup database
npm install -g supabase
supabase login
supabase link --project-ref your-ref-id
cd ..
supabase db push

# 4. Run!
cd frontend
npm run dev
```

Buka http://localhost:3000

📖 **Detailed Guide:** [QUICKSTART.md](./frontend/QUICKSTART.md) | [READY_TO_RUN.md](./READY_TO_RUN.md)

## 📁 Project Structure

```
lms-kampus/
├── frontend/              # Next.js 14 Application
│   ├── app/
│   │   ├── (auth)/       # Login, Register
│   │   ├── (student)/    # Student Dashboard
│   │   ├── (instructor)/ # Instructor Dashboard
│   │   ├── (admin)/      # Admin Panel
│   │   └── api/          # API Routes
│   ├── components/       # Reusable Components
│   ├── lib/
│   │   ├── supabase/     # Supabase clients
│   │   └── utils.js      # Utilities
│   └── middleware.js     # Auth middleware
│
├── supabase/
│   └── migrations/       # Database migrations
│
└── docs/                 # Documentation
```

## 🗄️ Database Schema

Database menggunakan PostgreSQL dengan Row Level Security (RLS).

**Main Tables:**
- `profiles` - User profiles (extends auth.users)
- `courses` - Course information
- `chapters` - Course chapters
- `lessons` - Lesson content
- `enrollments` - Student enrollments
- `lesson_progress` - Progress tracking
- `quizzes` - Quiz definitions
- `quiz_attempts` - Student attempts
- `certificates` - Generated certificates
- `live_sessions` - Live class sessions
- `notifications` - Real-time notifications

Lihat [migrations](./supabase/migrations/) untuk schema lengkap.

## 🔐 Authentication & Security

### Supabase Auth
- Email/Password authentication
- OAuth providers (Google, GitHub, etc)
- JWT tokens (automatic refresh)
- Email verification
- Password reset

### Row Level Security (RLS)
Semua tabel dilindungi dengan RLS policies:
- Students hanya bisa akses kursus yang di-enroll
- Instructors hanya bisa edit kursus sendiri
- Admin punya akses penuh
- Public bisa lihat kursus published

## 🔄 Real-time Features

Menggunakan Supabase Realtime untuk:
- Live notifications
- Progress updates
- Quiz results
- Announcements
- Discussion updates

```javascript
// Subscribe to notifications
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('New notification!', payload)
  })
  .subscribe()
```

## 📦 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables di Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 💰 Cost Estimation

### Free Tier (Perfect untuk Development & Small Scale)
- Supabase: $0 (500MB DB, 1GB storage, 2GB bandwidth)
- Vercel: $0 (hobby plan)
- **Total: $0/month** 🎉

### Production (Medium Scale - 1000 students)
- Supabase Pro: $25/mo (8GB DB, 100GB storage, 250GB bandwidth)
- Vercel Pro: $20/mo
- Cloudflare Stream: ~$5/mo (pay per use)
- **Total: ~$50/month**

### Comparison dengan Arsitektur Lama:
- **50% lebih murah** 💰
- **75% lebih sedikit services** 🎯
- **100% lebih simple** ✨

## 📖 Documentation

- 📘 [Quick Start (5 min)](./frontend/QUICKSTART.md) - Get running in 5 minutes
- ✅ [Ready to Run Checklist](./READY_TO_RUN.md) - What's built & what's next
- 🔧 [Setup Guide](./SETUP.md) - Detailed installation
- 🔄 [Migration Guide](./MIGRATION_TO_SUPABASE.md) - Architecture explanation
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- 📝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- ✅ [TODO List](./TODO.md) - Roadmap & progress

## 🤝 Contributing

Kontribusi sangat diterima! Lihat [CONTRIBUTING.md](./CONTRIBUTING.md) untuk guidelines.

## 📝 License

Project ini dilisensikan di bawah MIT License - lihat [LICENSE](./LICENSE) untuk detail.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [LiveKit](https://livekit.io/) - Video Infrastructure

## 📧 Support

- 🐛 [Report Bug](https://github.com/yourusername/lms-kampus/issues)
- 💡 [Request Feature](https://github.com/yourusername/lms-kampus/issues)

---

<div align="center">

**Made with ❤️ for Indonesian Education**

Powered by Supabase 🚀

[⬆ Back to Top](#lms-kampus---learning-management-system)

</div>
