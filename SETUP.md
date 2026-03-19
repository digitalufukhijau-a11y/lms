# Setup Guide - LMS Kampus (Supabase Edition)

## Prerequisites

- Node.js 18+
- Supabase account (gratis di [supabase.com](https://supabase.com))
- Git

## 1. Setup Supabase Project

### Buat Project Baru
1. Buka https://supabase.com dan login/signup
2. Klik "New Project"
3. Isi:
   - Name: `lms-kampus`
   - Database Password: (simpan ini!)
   - Region: Pilih terdekat (Singapore untuk Indonesia)
4. Tunggu ~2 menit sampai project siap

### Dapatkan Credentials
1. Buka project dashboard
2. Pergi ke **Settings > API**
   - Copy `Project URL` → ini `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → ini `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Setup Storage Bucket
1. Pergi ke **Storage** di sidebar
2. Klik "Create a new bucket"
3. Nama: `lms-files`
4. Public bucket: **Yes** (centang)
5. Klik "Create bucket"

## 2. Clone & Setup Project

```bash
# Clone repository
git clone <your-repo-url>
cd lms-kampus

# Masuk ke frontend folder
cd frontend

# Install dependencies
npm install
```

## 3. Setup Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit dengan credentials Supabase
nano .env.local  # atau gunakan editor favorit
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Setup Database

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login & Link Project
```bash
# Login ke Supabase
supabase login

# Link ke project Anda
supabase link --project-ref your-project-ref
```

**Cara dapat project-ref:**
- Buka Supabase dashboard
- Settings > General
- Copy "Reference ID"

### Push Migrations
```bash
# Push schema ke database
supabase db push
```

Ini akan membuat semua tabel yang dibutuhkan.

### Setup Auth Trigger

Buka **SQL Editor** di Supabase dashboard, jalankan:

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

### Seed Data (Optional)

Buat beberapa user test di **Authentication > Users**:

1. **Admin**
   - Email: admin@lms.edu
   - Password: Password123!
   - User Metadata: `{"full_name": "Admin LMS", "role": "admin"}`

2. **Dosen**
   - Email: dosen@lms.edu
   - Password: Password123!
   - User Metadata: `{"full_name": "Dr. Budi Santoso", "role": "instructor"}`

3. **Mahasiswa**
   - Email: mahasiswa@lms.edu
   - Password: Password123!
   - User Metadata: `{"full_name": "Andi Wijaya", "role": "student"}`

## 5. Start Development

```bash
# Dari folder frontend
npm run dev
```

Buka browser ke http://localhost:3000

## 6. Test Aplikasi

Login dengan credentials yang sudah dibuat:
- **Admin**: admin@lms.edu / Password123!
- **Dosen**: dosen@lms.edu / Password123!
- **Mahasiswa**: mahasiswa@lms.edu / Password123!

## Troubleshooting

### Error: "Invalid API key"
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- Cek apakah ada spasi atau karakter tersembunyi
- Restart dev server setelah ubah .env

### Error: "Bucket not found"
- Pastikan bucket `lms-files` sudah dibuat di Supabase Storage
- Pastikan bucket di-set sebagai public

### Error: "relation does not exist"
- Jalankan `supabase db push` lagi
- Cek di Supabase dashboard apakah tabel sudah ada

### Error: "Row Level Security policy violation"
- Pastikan RLS policies sudah di-apply (ada di migration kedua)
- Cek di Table Editor > Policies

## Next Steps

1. ✅ Buat kursus pertama sebagai dosen
2. ✅ Enroll sebagai mahasiswa
3. ✅ Upload materi
4. ✅ Test real-time notifications
5. ✅ Setup Cloudflare Stream untuk video (optional)
6. ✅ Setup LiveKit untuk live class (optional)

## Optional Services

### Cloudflare Stream (Video)
1. Buat account di Cloudflare
2. Enable Stream
3. Tambah ke `.env.local`:
```env
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

### LiveKit (Live Class)
1. Buat account di https://livekit.io
2. Create project
3. Tambah ke `.env.local`:
```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

### Resend (Email)
1. Buat account di https://resend.com
2. Verify domain
3. Tambah ke `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
```

## Production Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan deploy ke Vercel.

## Support

Untuk bantuan:
- 📖 Baca [MIGRATION_TO_SUPABASE.md](./MIGRATION_TO_SUPABASE.md)
- 🐛 Buka issue di GitHub
- 💬 Diskusi di GitHub Discussions
