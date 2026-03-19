# Quick Start - Running Locally

## Prerequisites
- Node.js 18+
- Supabase account (free at supabase.com)

## Step 1: Setup Supabase

1. Go to https://supabase.com and create account
2. Create new project:
   - Name: `lms-kampus`
   - Database Password: (save this!)
   - Region: Singapore (closest to Indonesia)
3. Wait ~2 minutes for project to be ready

## Step 2: Get Credentials

1. Go to **Settings > API**
   - Copy `Project URL` 
   - Copy `anon public` key
2. Go to **Settings > Database**
   - Copy "Reference ID" (you'll need this for CLI)

## Step 3: Setup Storage

1. Go to **Storage** in sidebar
2. Click "Create a new bucket"
3. Name: `lms-files`
4. Make it **Public**
5. Click "Create"

## Step 4: Install & Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Setup Database

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (use Reference ID from step 2)
supabase link --project-ref your-reference-id

# Push database schema
cd ..
supabase db push
```

## Step 6: Setup Auth Trigger

Go to Supabase Dashboard > **SQL Editor** and run:

```sql
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

## Step 7: Run Development Server

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Step 8: Create Test Users

Go to Supabase Dashboard > **Authentication > Users** > Add user

Create 3 test users:

1. **Student**
   - Email: student@test.com
   - Password: Test123!
   - User Metadata: `{"full_name": "Test Student", "role": "student"}`

2. **Instructor**
   - Email: instructor@test.com
   - Password: Test123!
   - User Metadata: `{"full_name": "Test Instructor", "role": "instructor"}`

3. **Admin**
   - Email: admin@test.com
   - Password: Test123!
   - User Metadata: `{"full_name": "Test Admin", "role": "admin"}`

## Step 9: Test the App

1. Go to http://localhost:3000
2. Click "Login"
3. Login with one of the test accounts
4. You should be redirected to the appropriate dashboard!

## Troubleshooting

### "Invalid API key"
- Check your `.env.local` file
- Make sure no extra spaces in the values
- Restart dev server after changing .env

### "Bucket not found"
- Make sure you created `lms-files` bucket in Supabase Storage
- Make sure it's set to Public

### "relation does not exist"
- Run `supabase db push` again
- Check Supabase Dashboard > Table Editor to see if tables exist

### "Row Level Security policy violation"
- Make sure you ran the second migration (RLS policies)
- Check Supabase Dashboard > Table Editor > Policies

## Next Steps

1. ✅ Create a course as instructor
2. ✅ Enroll as student
3. ✅ Upload course materials
4. ✅ Test real-time features

## Need Help?

- Check [SETUP.md](./SETUP.md) for detailed guide
- Check [MIGRATION_TO_SUPABASE.md](./MIGRATION_TO_SUPABASE.md) for architecture info
- Open an issue on GitHub
