# 🚀 Quick Start - UI Blueprint Implementation

## ✅ Apa yang Sudah Selesai

Blueprint UI sudah diimplementasikan dengan:
- ✅ Design system lengkap (colors, typography, spacing)
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Core components (Button, Card, Badge, Input)
- ✅ Navbar dengan theme toggle
- ✅ Course card component
- ✅ Landing page baru

## 🏃 Cara Running (3 Langkah)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Setup Supabase (Pilih salah satu)

#### Option A: Pakai Supabase Local (Recommended untuk dev)
```bash
# Di root project
npx supabase start
```
File `.env.local` sudah diset untuk local Supabase.

#### Option B: Pakai Supabase Cloud
Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

Buka http://localhost:3000

## 🎨 Apa yang Bisa Dilihat

1. **Landing Page** (/) - Hero, stats, features, CTA
2. **Dark Mode Toggle** - Klik icon moon/sun di navbar
3. **Responsive Design** - Resize browser untuk lihat mobile/tablet view
4. **Course Cards** - Hover untuk lihat animasi
5. **Navbar** - User menu, notifications (UI only, belum connect ke backend)

## 📂 File Penting yang Diubah

```
frontend/
├── app/
│   ├── layout.js          ← Font DM Sans & DM Serif
│   ├── providers.js       ← Theme provider
│   ├── page.js            ← Landing page baru
│   └── globals.css        ← Design tokens (colors, etc)
├── components/
│   ├── ui/
│   │   ├── button.jsx     ← Button dengan variants
│   │   ├── card.jsx       ← Card dengan hover
│   │   ├── badge.jsx      ← Badge 7 variants
│   │   └── input.jsx      ← Input dengan error state
│   ├── navbar.jsx         ← Navbar baru dengan dark mode
│   └── course-card.jsx    ← Course card sesuai blueprint
├── tailwind.config.js     ← Design tokens
└── package.json           ← Dependencies baru
```

## 🎯 Design System Cheat Sheet

### Colors
```jsx
// Brand (hijau)
className="bg-brand-500 text-white"
className="text-brand-500"

// Text
className="text-ink-900"  // Heading
className="text-ink-600"  // Body secondary
className="text-ink-400"  // Placeholder

// Background
className="bg-surface-0"  // Card
className="bg-surface-1"  // Page background
className="bg-surface-2"  // Input background
```

### Typography
```jsx
// Heading (serif)
<h1 className="text-5xl font-serif">Hero Title</h1>
<h2 className="text-4xl font-serif">Section Title</h2>

// Body (sans)
<p className="text-base">Normal text</p>
<p className="text-sm">Small text</p>
<p className="text-xs font-medium">Label</p>
```

### Components
```jsx
// Button
<Button variant="primary">Primary</Button>
<Button variant="ghost">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="link">Link</Button>

// Badge
<Badge variant="success">Selesai</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="brand">Baru</Badge>

// Input
<Input placeholder="Email" />
<Input error placeholder="Email" />  // Error state
```

## 🔧 Troubleshooting

### Error: Supabase URL required
**Solusi**: Pastikan file `.env.local` ada dan berisi credentials yang benar.

### Error: Module not found
**Solusi**: 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Dark mode tidak jalan
**Solusi**: Clear browser cache atau buka incognito window.

### Tailwind classes tidak apply
**Solusi**: Restart dev server (Ctrl+C lalu `npm run dev` lagi).

## 📝 Next Steps

Halaman yang perlu diimplementasikan selanjutnya (sesuai blueprint):

### Priority 1 - Auth & Core
- [ ] Login page dengan form validation
- [ ] Register page dengan form validation
- [ ] Course catalog dengan filter & search
- [ ] Course detail page

### Priority 2 - Student Dashboard
- [ ] Student dashboard dengan metrics
- [ ] Course player dengan video
- [ ] Quiz interface
- [ ] Profile page

### Priority 3 - Instructor
- [ ] Instructor dashboard
- [ ] Course builder
- [ ] Quiz builder

## 🎨 Design Reference

Semua spesifikasi ada di `LMS-UI-Blueprint.docx`:
- Section 2: Design System (colors, typography, spacing)
- Section 3: Component specs
- Section 5: Page specifications (22 halaman)

## 💡 Tips Development

1. **Gunakan design tokens** - Jangan hardcode colors, pakai `text-brand-500`, `bg-surface-0`, dll
2. **Test dark mode** - Setiap komponen harus bagus di light & dark
3. **Test responsive** - Mobile first, lalu tablet, desktop
4. **Accessibility** - Semua interactive elements harus bisa di-tab
5. **Consistent spacing** - Pakai `p-4`, `p-6`, `gap-3`, dll (kelipatan 4px)

## 🐛 Known Issues

- Build error karena halaman lain masih pakai Supabase (normal, akan fix saat implement halaman tersebut)
- npm vulnerabilities (non-critical, dari dependencies)
- Line clamp warning (sudah built-in di Tailwind v3.3+, bisa ignore)

## 📞 Need Help?

Cek file-file ini:
- `IMPLEMENTATION_BLUEPRINT.md` - Detail implementasi
- `LMS-UI-Blueprint.docx` - Design specs lengkap
- `frontend/app/globals.css` - CSS variables
- `frontend/tailwind.config.js` - Tailwind config

---

**Status**: ✅ Design system implemented, ready untuk development halaman-halaman lainnya!
