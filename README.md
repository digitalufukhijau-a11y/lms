# 🎓 LMS Kampus

Modern Learning Management System untuk institusi pendidikan, dibangun dengan Next.js 14 dan Supabase.

## ✨ Features

- 🔐 Authentication & Role-based Access (Student, Instructor, Admin)
- 📚 Course Management dengan chapters & lessons
- 📝 Quiz & Assessment system
- 📊 Progress Tracking
- 🎥 Video Lessons (ready for integration)
- 📱 Responsive Design (Mobile-first)
- 🌙 Dark Mode Support
- 🎨 Modern UI dengan Design System lengkap

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier)

### Setup (10 menit)

1. **Clone & Install**
```bash
git clone <repo-url>
cd lms-kampus/frontend
npm install
```

2. **Setup Supabase**
- Buat project di [supabase.com](https://supabase.com)
- Copy Project URL & anon key

3. **Configure Environment**
```bash
cp .env.local.template .env.local
# Edit .env.local dengan Supabase credentials
```

4. **Push Database**
```bash
npm install -g supabase
supabase login
cd ..
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

5. **Run Development Server**
```bash
cd frontend
npm run dev
```

Buka http://localhost:3000

📖 **Panduan lengkap:** [QUICK_START_UI.md](./QUICK_START_UI.md)

## 📁 Project Structure

```
lms-kampus/
├── frontend/                    # Next.js Application
│   ├── app/                     # App Router pages
│   │   ├── (auth)/             # Login & Register
│   │   ├── (student)/          # Student Dashboard
│   │   ├── (instructor)/       # Instructor Dashboard
│   │   ├── courses/            # Course pages
│   │   └── page.js             # Landing page
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── navbar.jsx          # Main navigation
│   │   └── course-card.jsx     # Course card
│   ├── lib/
│   │   └── supabase/           # Supabase clients
│   └── middleware.js           # Auth middleware
│
├── supabase/
│   └── migrations/             # Database schema
│
└── docs/                       # Documentation
```

## 🎨 Design System

Project ini menggunakan design system lengkap berdasarkan blueprint UI:

- **Colors**: Brand (hijau), Accent (ungu), Semantic colors
- **Typography**: DM Sans (body) + DM Serif Display (headings)
- **Components**: Button, Card, Badge, Input, dll
- **Dark Mode**: Full support dengan smooth transitions
- **Responsive**: Mobile-first dengan breakpoints konsisten

📖 **Detail:** [IMPLEMENTATION_BLUEPRINT.md](./IMPLEMENTATION_BLUEPRINT.md)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod

### Backend (Supabase)
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Security**: Row Level Security (RLS)

## 📊 Progress

| Feature | Status |
|---------|--------|
| Design System | ✅ Complete |
| Authentication | ✅ Complete |
| Landing Page | ✅ Complete |
| Course Listing | ✅ Complete |
| Student Dashboard | ✅ Complete |
| Instructor Dashboard | ✅ Basic |
| Course Detail | 🚧 In Progress |
| Lesson Player | ⏳ Planned |
| Quiz System | ⏳ Planned |
| Certificates | ⏳ Planned |
| Live Class | ⏳ Planned |
| Admin Panel | ⏳ Planned |

📖 **Detail:** [UI_IMPLEMENTATION_SUMMARY.md](./UI_IMPLEMENTATION_SUMMARY.md)

## 📚 Documentation

- [Quick Start Guide](./QUICK_START_UI.md) - Cara running project
- [UI Implementation Summary](./UI_IMPLEMENTATION_SUMMARY.md) - Summary implementasi
- [Implementation Blueprint](./IMPLEMENTATION_BLUEPRINT.md) - Detail teknis
- [Architecture](./MIGRATION_TO_SUPABASE.md) - Penjelasan arsitektur
- [Contributing](./CONTRIBUTING.md) - Panduan kontribusi
- [Changelog](./CHANGELOG.md) - Riwayat perubahan
- [TODO](./TODO.md) - Task tracking

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🎯 Roadmap

### Phase 1: Core Features (Current)
- [x] Design system implementation
- [x] Authentication & authorization
- [x] Landing & course listing
- [ ] Course detail & enrollment
- [ ] Lesson player

### Phase 2: Assessment
- [ ] Quiz creation (instructor)
- [ ] Quiz taking (student)
- [ ] Auto-grading
- [ ] Results & analytics

### Phase 3: Advanced
- [ ] Certificate generation
- [ ] Live class integration
- [ ] Real-time notifications
- [ ] Discussion forum

### Phase 4: Polish
- [ ] Admin panel
- [ ] Email notifications
- [ ] Mobile optimization
- [ ] Performance tuning

## 💡 Tips

1. **Baca [QUICK_START_UI.md](./QUICK_START_UI.md) dulu** - Panduan lengkap setup
2. **Test dark mode** - Toggle di navbar untuk lihat dark mode
3. **Responsive design** - Resize browser untuk test mobile view
4. **Design tokens** - Gunakan design tokens dari `globals.css`, jangan hardcode colors

## 🐛 Troubleshooting

**Error: "Invalid API key"**
- Check `.env.local` file
- Restart dev server

**Error: "relation does not exist"**
- Run `supabase db push` again

**Build errors on other pages**
- Normal, halaman lain belum update ke design system baru

📖 **More:** [QUICK_START_UI.md](./QUICK_START_UI.md#troubleshooting)

---

**Status**: ✅ Foundation Complete, Ready for Development  
**Last Updated**: 19 Maret 2026  
**Version**: 2.0.0 (Supabase Edition)
