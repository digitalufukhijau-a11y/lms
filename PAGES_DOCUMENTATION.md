# 📚 Dokumentasi Lengkap Semua Halaman

## 🎨 Design System yang Digunakan

Semua halaman menggunakan:
- **Colors**: 13 color tokens (brand, accent, ink, surface, success, danger, warn, info)
- **Typography**: DM Sans (body) + DM Serif Display (headings)
- **Spacing**: 4px base unit (p-4, p-6, p-8, gap-3, gap-6)
- **Components**: Reusable UI components
- **Dark Mode**: Full support dengan smooth transitions
- **Responsive**: Mobile-first, tablet, desktop breakpoints

---

## 🌐 PUBLIC PAGES

### 1. Landing Page (`/`)

**Purpose**: Homepage untuk attract visitors dan showcase platform

**Sections**:
1. **Hero Section**
   - Judul besar dengan DM Serif Display
   - Subtitle descriptive
   - 2 CTA buttons (Mulai Belajar, Lihat Kursus)
   - Background gradient brand colors

2. **Stats Section**
   - 4 stat cards (Students, Courses, Instructors, Completion Rate)
   - Icon dengan background colored
   - Animated numbers

3. **Features Section**
   - Grid 3 kolom
   - Icon + Title + Description
   - Features: Expert Instructors, Flexible Learning, Certificates

4. **CTA Section**
   - Call to action untuk register
   - Button primary

5. **Footer**
   - Links (About, Courses, Contact)
   - Copyright text

**Components Used**: Card, Button, Badge

---

### 2. Login Page (`/login`)

**Purpose**: User authentication

**Features**:
- Email input dengan validation
- Password input dengan eye toggle (show/hide)
- Remember me checkbox
- Login button dengan loading state
- Link ke register page
- Forgot password link
- Error message display

**Form Validation**:
- Email format check
- Required fields
- Error states dengan red border

**Components Used**: Input, Button, Label

---

### 3. Register Page (`/register`)

**Purpose**: New user registration

**Features**:
- Full name input
- Email input dengan validation
- NIM/NIP input
- Password input dengan strength indicator
- Confirm password dengan match validation
- Role selection (Student/Instructor) dengan Select component
- Register button dengan loading state
- Link ke login page

**Password Strength Indicator**:
- Weak (red)
- Medium (yellow)
- Strong (green)
- Progress bar visual

**Components Used**: Input, Button, Label, Select, Progress

---

### 4. Course Catalog (`/courses`)

**Purpose**: Browse dan search courses

**Features**:
1. **Header**
   - Page title
   - Search bar dengan icon
   - Filter dropdown (Category, Level, Price)
   - View toggle (Grid/List)

2. **Course Grid/List**
   - Course cards dengan:
     - Thumbnail image
     - Title
     - Instructor name
     - Rating stars
     - Price
     - Enrollment count
     - Duration
     - Level badge
   - Hover effects (shadow, border)

3. **Pagination**
   - Previous/Next buttons
   - Page numbers

**Components Used**: Card, Badge, Button, Input, Select

---

### 5. Course Detail (`/courses/[slug]`)

**Purpose**: Detailed course information

**Features**:
1. **Hero Section**
   - Course title (large, serif)
   - Instructor info dengan avatar
   - Rating dan reviews count
   - Enrollment count
   - Last updated date

2. **Tabs Navigation**
   - About
   - Curriculum
   - Instructor
   - Reviews

3. **Tab Content**:
   
   **About Tab**:
   - Course description
   - What you'll learn (bullet points)
   - Requirements
   - Target audience

   **Curriculum Tab**:
   - Accordion chapters
   - Lessons list dengan:
     - Lesson title
     - Duration
     - Content type icon (video/pdf/quiz)
     - Preview badge (if free)
     - Lock icon (if not enrolled)

   **Instructor Tab**:
   - Instructor bio
   - Stats (courses, students, rating)
   - Other courses by instructor

   **Reviews Tab**:
   - Review cards dengan:
     - Student name + avatar
     - Rating stars
     - Date
     - Comment text
   - Write review form (if enrolled)

4. **Sticky Sidebar**:
   - Course thumbnail
   - Price
   - Enroll button (primary, large)
   - Course includes list
   - Share buttons

**Components Used**: Card, Badge, Button, Textarea, Progress

---

## 🎓 STUDENT PAGES

### 6. Student Dashboard (`/student`)

**Purpose**: Student home dengan overview progress

**Layout**: 2 columns (main + sidebar)

**Main Content**:
1. **Stats Cards** (4 cards)
   - Enrolled Courses
   - Completed Courses
   - Certificates Earned
   - Learning Hours
   - Icon dengan colored background
   - Large number (serif font)

2. **Continue Learning Section**
   - Course cards dengan progress bar
   - "Continue" button
   - Last accessed timestamp

3. **Recent Activities**
   - Timeline style
   - Activity type icon
   - Description
   - Timestamp

**Sidebar**:
1. **Quick Stats**
   - Current streak
   - Points earned
   - Rank/Level

2. **Upcoming Deadlines**
   - Quiz deadlines
   - Assignment deadlines
   - Live class schedule

**Components Used**: Card, Progress, Badge, Button

---

### 7. Course Player (`/student/courses/[slug]/learn`)

**Purpose**: Watch course content dan track progress

**Layout**: Split screen (video + sidebar)

**Main Area**:
1. **Video Player**
   - HTML5 video player
   - Play/pause controls
   - Progress bar
   - Volume control
   - Fullscreen button
   - Playback speed

2. **Lesson Info**
   - Lesson title
   - Description
   - Resources download links
   - Notes section (textarea)

3. **Navigation**
   - Previous lesson button
   - Next lesson button
   - Mark as complete checkbox

**Sidebar**:
1. **Course Progress**
   - Overall progress bar
   - X of Y lessons completed

2. **Curriculum Navigation**
   - Chapters accordion
   - Lessons list dengan:
     - Checkmark (if completed)
     - Current indicator (highlighted)
     - Duration
     - Click to navigate

**Components Used**: Card, Progress, Button, Textarea

---

### 8. Quiz Interface (`/student/quiz/[id]`)

**Purpose**: Take quiz/exam

**Features**:
1. **Header**
   - Quiz title
   - Timer (countdown)
   - Question counter (X of Y)
   - Submit button

2. **Question Display**
   - Question number
   - Question text
   - Image (if any)
   - Points value

3. **Answer Options**:
   
   **Multiple Choice**:
   - Radio buttons
   - Option text
   - Select one

   **True/False**:
   - 2 radio buttons
   - True/False labels

   **Essay**:
   - Textarea
   - Character count

4. **Question Navigator**
   - Grid of question numbers
   - Status indicators:
     - Answered (green)
     - Flagged (yellow)
     - Unanswered (gray)
   - Click to jump to question

5. **Actions**:
   - Flag question button
   - Previous/Next buttons
   - Submit quiz button (with confirmation)

**Auto-save**: Answers saved automatically

**Components Used**: Card, Button, Input, Textarea, Badge

---

### 9. Quiz Results (`/student/quiz/[id]/result/[attemptId]`)

**Purpose**: View quiz score dan review answers

**Features**:
1. **Score Card** (large, centered)
   - Score percentage (large serif number)
   - Pass/Fail badge
   - Points earned / total points
   - Time taken
   - Attempt number

2. **Stats Row**
   - Correct answers count
   - Incorrect answers count
   - Unanswered count

3. **Answer Review**
   - Question by question
   - Each question shows:
     - Question text
     - Your answer (highlighted)
     - Correct answer (if wrong)
     - Explanation (if available)
     - Points earned
   - Color coding:
     - Green border (correct)
     - Red border (incorrect)

4. **Actions**:
   - Retry quiz button (if attempts remaining)
   - Back to course button
   - Download certificate button (if passed)

**Components Used**: Card, Badge, Button, Progress

---

### 10. Student Profile (`/student/profile`)

**Purpose**: View dan edit profile

**Layout**: 2 columns

**Left Column**:
1. **Profile Card**
   - Avatar (large, circular)
   - Upload avatar button
   - Name (editable)
   - NIM
   - Email
   - Role badge

2. **Stats**
   - Courses enrolled
   - Courses completed
   - Certificates earned
   - Total learning hours

**Right Column**:
1. **Edit Profile Form**
   - Full name input
   - Email input (disabled)
   - NIM input (disabled)
   - Bio textarea
   - Phone number input
   - Save changes button

2. **Change Password Section**
   - Current password input
   - New password input
   - Confirm password input
   - Update password button

**Components Used**: Card, Input, Textarea, Button, Badge

---

### 11. My Courses (`/student/my-courses`)

**Purpose**: List of enrolled courses

**Features**:
1. **Filter Tabs**
   - All Courses
   - In Progress
   - Completed
   - Active tab highlighted

2. **Course Cards**
   - Thumbnail
   - Title
   - Instructor
   - Progress bar dengan percentage
   - Last accessed date
   - Continue learning button
   - Status badge (In Progress/Completed)

3. **Empty State**
   - Icon
   - "No courses yet" message
   - Browse courses button

**Components Used**: Card, Progress, Badge, Button, EmptyState

---

### 12. Certificates (`/student/certificates`)

**Purpose**: View earned certificates

**Features**:
1. **Certificate Grid**
   - Certificate cards dengan:
     - Certificate preview image
     - Course title
     - Issued date
     - Certificate number
     - Download PDF button
     - Share button

2. **Certificate Details Modal** (on click)
   - Full certificate view
   - Student name
   - Course name
   - Completion date
   - Instructor signature
   - Download button
   - Share to LinkedIn button

3. **Empty State**
   - Icon
   - "No certificates yet" message
   - Complete courses to earn message

**Components Used**: Card, Button, Badge, EmptyState

---

## 👨‍🏫 INSTRUCTOR PAGES

### 13. Instructor Dashboard (`/instructor`)

**Purpose**: Instructor home dengan course management

**Layout**: 2 columns (main + sidebar)

**Main Content**:
1. **Stats Cards** (4 cards)
   - Total Courses
   - Total Students
   - Average Rating
   - Active Courses
   - Icon dengan colored background

2. **My Courses Section**
   - Course list dengan:
     - Thumbnail
     - Title
     - Student count
     - Status badge (Published/Draft)
     - Edit button
     - Analytics button
   - "View All" link

**Sidebar**:
1. **Recent Activity**
   - New enrollments
   - Student name
   - Course name
   - Timestamp

2. **Quick Actions**
   - Create New Course button
   - Create New Quiz button
   - View Analytics button

**Components Used**: Card, Badge, Button

---

### 14. Create Course (`/instructor/courses/new`)

**Purpose**: Create new course dengan curriculum

**Multi-Step Form**:

**Step 1: Basic Info**
1. **Course Information**
   - Title input (auto-generates slug)
   - Slug input (editable)
   - Description textarea
   - Price input (number)
   - Passing score input (percentage)
   - Thumbnail URL input
   - Next button

**Step 2: Curriculum**
1. **Chapters**
   - Add chapter button
   - Each chapter:
     - Chapter title input
     - Order number
     - Remove chapter button

2. **Lessons** (per chapter)
   - Add lesson button
   - Each lesson:
     - Lesson title input
     - Content type select (Video/PDF/Text/Quiz)
     - Content URL input
     - Duration input (seconds)
     - Free preview checkbox
     - Remove lesson button

3. **Actions**:
   - Back button (to step 1)
   - Save Course button

**Dynamic Features**:
- Add/remove chapters
- Add/remove lessons
- Drag to reorder (future)

**Components Used**: Card, Input, Textarea, Select, Button

---

### 15. Edit Course (`/instructor/courses/[id]/edit`)

**Purpose**: Update existing course

**Features**:
1. **Course Info Form**
   - All fields from create course
   - Pre-filled dengan existing data
   - Status select (Draft/Published/Archived)

2. **Actions**:
   - Save Changes button
   - Delete Course button (danger)
   - Cancel button

**Confirmation**:
- Delete confirmation modal
- Unsaved changes warning

**Components Used**: Card, Input, Textarea, Select, Button

---

### 16. Quiz Builder (`/instructor/quizzes/new`)

**Purpose**: Create quiz dengan questions

**Features**:
1. **Quiz Info**
   - Course select dropdown
   - Quiz title input
   - Description textarea
   - Time limit input (minutes)
   - Max attempts input
   - Passing score input (percentage)
   - Randomize questions checkbox

2. **Questions Section**
   - Add question button
   - Each question card:
     - Question number
     - Question text textarea
     - Question type select (Multiple Choice/True-False/Essay)
     - Points input
     - Remove question button

3. **Options** (for Multiple Choice)
   - Add option button
   - Each option:
     - Radio button (mark as correct)
     - Option text input
     - Remove option button
   - Minimum 2 options

4. **Actions**:
   - Save Quiz button
   - Cancel button

**Dynamic Features**:
- Add/remove questions
- Add/remove options
- Mark correct answer

**Components Used**: Card, Input, Textarea, Select, Button

---

### 17. Course Analytics (`/instructor/courses/[id]/analytics`)

**Purpose**: View course performance metrics

**Features**:
1. **Stats Grid** (6 cards)
   - Total Enrollments
   - Active Students
   - Completed Students
   - Average Progress
   - Average Quiz Score
   - Total Revenue
   - Icon dengan colored background
   - Trend indicator (up/down arrow)

2. **Student Progress List**
   - Student cards dengan:
     - Avatar
     - Name
     - Progress bar dengan percentage
     - Status badge (Active/Completed)
   - Top 10 students

3. **Charts** (future enhancement)
   - Enrollment over time
   - Completion rate
   - Quiz scores distribution

**Components Used**: Card, Progress, Badge

---

### 18. Student Management (`/instructor/courses/[id]/students`)

**Purpose**: Manage enrolled students

**Features**:
1. **Search Bar**
   - Search by name or NIM
   - Real-time filtering

2. **Student List**
   - Student cards dengan:
     - Avatar
     - Name
     - NIM
     - Enrollment date
     - Completion date (if completed)
     - Progress bar dengan percentage
     - Status badge (Active/Completed/Dropped)

3. **Actions** (per student):
   - View progress detail
   - Send message (future)
   - Remove from course (future)

4. **Empty State**
   - "No students yet" message

**Components Used**: Card, Input, Progress, Badge, EmptyState

---

### 19. Live Classes (`/instructor/live-classes`)

**Purpose**: Schedule dan manage live sessions

**Features**:
1. **Create Session Form** (collapsible)
   - Course select
   - Session title input
   - Date & time picker
   - Duration input (minutes)
   - Meeting URL input (Zoom/Google Meet)
   - Schedule button

2. **Sessions List**
   - Session cards dengan:
     - Video icon
     - Title
     - Course name
     - Date & time
     - Duration
     - Participant count
     - Status badge (Scheduled/Ongoing/Completed/Cancelled)
     - Open meeting button
     - Delete button

3. **Empty State**
   - "No sessions yet" message
   - Schedule first session button

**Components Used**: Card, Input, Select, Button, Badge, EmptyState

---

## 👑 ADMIN PAGES

### 20. Admin Dashboard (`/admin`)

**Purpose**: System overview dan management

**Layout**: 2 columns (main + sidebar)

**Main Content**:
1. **Stats Cards** (4 cards)
   - Total Users
   - Total Courses
   - Total Enrollments
   - Active Courses
   - Icon dengan colored background

2. **Recent Activities**
   - Activity feed
   - User enrollments
   - Course publications
   - Timestamp

3. **User Distribution**
   - Students count dengan badge
   - Instructors count dengan badge
   - Admins count dengan badge

**Sidebar**:
1. **Admin Menu**
   - Manage Users button
   - Reports & Analytics button
   - System Settings button

2. **System Info**
   - Platform name
   - Version
   - Status badge (Online/Offline)

**Components Used**: Card, Badge, Button

---

### 21. User Management (`/admin/users`)

**Purpose**: Manage all users

**Features**:
1. **Filters**
   - Search bar (name, NIM)
   - Role filter dropdown (All/Student/Instructor/Admin)

2. **User List**
   - User cards dengan:
     - Avatar
     - Name
     - NIM/NIP (if any)
     - Join date
     - Role badge
     - Role select dropdown (change role)
     - Delete button

3. **Actions**:
   - Change user role
   - Delete user (with confirmation)

4. **Empty State**
   - "No users found" message

**Components Used**: Card, Input, Select, Badge, Button, EmptyState

---

### 22. System Settings (`/admin/settings`)

**Purpose**: Configure platform settings

**Sections**:

1. **General Settings**
   - Site name input
   - Site description textarea
   - Contact email input

2. **Course Settings**
   - Default passing score input (percentage)
   - Max upload size input (MB)
   - Enable course reviews checkbox
   - Enable certificates checkbox

3. **User Settings**
   - Enable registration checkbox
   - Default user role select

4. **Actions**:
   - Save Settings button
   - Cancel button

**Components Used**: Card, Input, Textarea, Select, Button

---

### 23. Reports & Analytics (`/admin/reports`)

**Purpose**: Platform-wide analytics

**Features**:
1. **Time Range Filter**
   - Dropdown (7 days, 30 days, 90 days, 1 year)
   - Export CSV button

2. **Stats Grid** (4 cards)
   - New Users
   - New Enrollments
   - Completed Courses
   - Completion Rate
   - Trend indicators

3. **Top Courses**
   - Ranked list (1-5)
   - Course name
   - Enrollment count

4. **Top Instructors**
   - Ranked list (1-5)
   - Instructor name
   - Course count

**Export Feature**:
- Download CSV dengan stats

**Components Used**: Card, Select, Button, Badge

---

## 🎯 Summary

**Total Pages**: 22
**Total Components**: 13
**Total Routes**: 23 (including dynamic routes)

**Fitur Lengkap**:
- ✅ Authentication & Authorization
- ✅ Course Management (CRUD)
- ✅ Quiz System
- ✅ Progress Tracking
- ✅ Analytics & Reports
- ✅ User Management
- ✅ Live Classes
- ✅ Certificates
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Form Validation
- ✅ Loading States
- ✅ Empty States
- ✅ Error Handling

**Semua halaman siap production!** 🚀
