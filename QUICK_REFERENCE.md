# 🚀 Quick Reference - Test URLs

## 📍 All Page URLs

Copy-paste URLs ini ke browser untuk test setiap halaman:

### 🌐 Public Pages
```
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/courses
http://localhost:3000/courses/pemrograman-web-react
```

### 🎓 Student Pages
```
http://localhost:3000/student
http://localhost:3000/student/profile
http://localhost:3000/student/my-courses
http://localhost:3000/student/certificates
http://localhost:3000/student/courses/pemrograman-web-react/learn
http://localhost:3000/student/quiz/quiz-id-123
http://localhost:3000/student/quiz/quiz-id-123/result/attempt-id-456
```

### 👨‍🏫 Instructor Pages
```
http://localhost:3000/instructor
http://localhost:3000/instructor/courses/new
http://localhost:3000/instructor/courses/course-id-123/edit
http://localhost:3000/instructor/courses/course-id-123/analytics
http://localhost:3000/instructor/courses/course-id-123/students
http://localhost:3000/instructor/quizzes/new
http://localhost:3000/instructor/live-classes
```

### 👑 Admin Pages
```
http://localhost:3000/admin
http://localhost:3000/admin/users
http://localhost:3000/admin/settings
http://localhost:3000/admin/reports
```

---

## 🎯 Testing Workflow

### 1. Test UI Components (No Supabase needed)
✅ Pages yang bisa langsung ditest:

**Login Page**
```
http://localhost:3000/login
```
- Test form validation
- Test eye toggle
- Test dark mode

**Register Page**
```
http://localhost:3000/register
```
- Test password strength indicator
- Test role selection
- Test form validation

**Course Player**
```
http://localhost:3000/student/courses/test-slug/learn
```
- Test video player UI
- Test sidebar navigation
- Test progress bar

**Quiz Interface**
```
http://localhost:3000/student/quiz/test-id
```
- Test timer display
- Test question navigator
- Test answer selection

**Quiz Results**
```
http://localhost:3000/student/quiz/test-id/result/test-attempt
```
- Test score display
- Test answer review UI
- Test retry button

---

### 2. Test dengan Supabase

Setelah setup Supabase, test workflow ini:

#### Student Workflow
1. Register → `/register`
2. Login → `/login`
3. Browse courses → `/courses`
4. View course detail → `/courses/[slug]`
5. Enroll in course
6. Learn course → `/student/courses/[slug]/learn`
7. Take quiz → `/student/quiz/[id]`
8. View results → `/student/quiz/[id]/result/[attemptId]`
9. View certificates → `/student/certificates`

#### Instructor Workflow
1. Login as instructor → `/login`
2. View dashboard → `/instructor`
3. Create course → `/instructor/courses/new`
4. Edit course → `/instructor/courses/[id]/edit`
5. Create quiz → `/instructor/quizzes/new`
6. View analytics → `/instructor/courses/[id]/analytics`
7. Manage students → `/instructor/courses/[id]/students`
8. Schedule live class → `/instructor/live-classes`

#### Admin Workflow
1. Login as admin → `/login`
2. View dashboard → `/admin`
3. Manage users → `/admin/users`
4. View reports → `/admin/reports`
5. Configure settings → `/admin/settings`

---

## 🎨 Design System Testing

### Dark Mode Toggle
1. Buka halaman manapun
2. Click icon moon/sun di navbar (top right)
3. Verify smooth transition
4. Check all colors berubah properly

### Responsive Testing
Test di berbagai ukuran:

**Mobile** (375px)
```
- Open DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Select iPhone SE or similar
- Navigate through pages
```

**Tablet** (768px)
```
- Select iPad or similar
- Test navigation
- Test grid layouts
```

**Desktop** (1440px)
```
- Full screen browser
- Test all features
- Check spacing & layout
```

---

## 🔍 Component Testing

### Button Variants
Test di halaman manapun:
- Primary button (brand color)
- Ghost button (border only)
- Danger button (red)
- Link button (text only)

### Badge Variants
Test di course catalog atau dashboard:
- Success (green)
- Warning (yellow)
- Danger (red)
- Info (blue)
- Brand (green)
- Accent (purple)
- Neutral (gray)

### Form Components
Test di login/register page:
- Input dengan focus state
- Input dengan error state
- Textarea
- Select dropdown
- Checkbox
- Radio buttons

### Loading States
Test di pages dengan data fetching:
- LoadingSpinner component
- Skeleton loaders
- Button loading state

### Empty States
Test di pages dengan no data:
- My Courses (no courses)
- Certificates (no certificates)
- Live Classes (no sessions)

---

## 📊 Performance Testing

### Build Test
```bash
cd frontend
npm run build
```
Expected: ✅ Success, no errors

### Dev Server Test
```bash
cd frontend
npm run dev
```
Expected: Server running at http://localhost:3000

### Route Test
```bash
cd frontend
node test-routes.js
```
Expected: 
- 5 pages OK (auth, quiz pages)
- 18 pages need Supabase (expected)

---

## 🐛 Troubleshooting

### Issue: 500 Error
**Cause**: Supabase not configured
**Solution**: Setup Supabase atau test pages yang tidak perlu Supabase

### Issue: Page Not Found
**Cause**: Typo di URL atau dev server not running
**Solution**: Check URL spelling, restart dev server

### Issue: Styles Not Loading
**Cause**: Tailwind not compiled
**Solution**: Restart dev server

### Issue: Dark Mode Not Working
**Cause**: next-themes not initialized
**Solution**: Check providers.js, restart server

---

## ✅ Quick Checklist

Sebelum testing, pastikan:
- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file exists
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened to http://localhost:3000

Untuk full testing:
- [ ] Supabase project created
- [ ] Migrations run
- [ ] Sample data inserted
- [ ] Test users created

---

## 📝 Notes

**Pages yang bisa ditest tanpa Supabase:**
- ✅ Login page (UI only)
- ✅ Register page (UI only)
- ✅ Course player (UI only)
- ✅ Quiz interface (UI only)
- ✅ Quiz results (UI only)

**Pages yang perlu Supabase:**
- ⚠️ Landing page (needs stats data)
- ⚠️ Course catalog (needs course data)
- ⚠️ All dashboards (needs user data)
- ⚠️ All management pages (needs database)

**Recommended Testing Order:**
1. Test UI-only pages first (5 menit)
2. Setup Supabase (10 menit)
3. Test all pages with data (30 menit)

---

## 🎉 Happy Testing!

Semua halaman sudah siap untuk ditest. Tinggal:
1. Start dev server
2. Open browser
3. Copy-paste URLs
4. Test features

**Enjoy!** 🚀
