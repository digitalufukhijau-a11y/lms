// Test script untuk verify semua routes accessible
const routes = [
  // Public routes
  { path: '/', name: 'Landing Page' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/courses', name: 'Course Catalog' },
  { path: '/courses/test-slug', name: 'Course Detail' },
  
  // Student routes
  { path: '/student', name: 'Student Dashboard' },
  { path: '/student/profile', name: 'Student Profile' },
  { path: '/student/my-courses', name: 'My Courses' },
  { path: '/student/certificates', name: 'Certificates' },
  { path: '/student/courses/test-slug/learn', name: 'Course Player' },
  { path: '/student/quiz/test-id', name: 'Quiz Interface' },
  { path: '/student/quiz/test-id/result/test-attempt', name: 'Quiz Results' },
  
  // Instructor routes
  { path: '/instructor', name: 'Instructor Dashboard' },
  { path: '/instructor/courses/new', name: 'Create Course' },
  { path: '/instructor/courses/test-id/edit', name: 'Edit Course' },
  { path: '/instructor/courses/test-id/analytics', name: 'Course Analytics' },
  { path: '/instructor/courses/test-id/students', name: 'Student Management' },
  { path: '/instructor/quizzes/new', name: 'Create Quiz' },
  { path: '/instructor/live-classes', name: 'Live Classes' },
  
  // Admin routes
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/users', name: 'User Management' },
  { path: '/admin/settings', name: 'System Settings' },
  { path: '/admin/reports', name: 'Reports & Analytics' },
];

async function testRoute(route) {
  try {
    const response = await fetch(`http://localhost:3000${route.path}`);
    const status = response.status;
    const statusText = status === 200 ? '✅ OK' : status === 404 ? '❌ NOT FOUND' : `⚠️  ${status}`;
    console.log(`${statusText} - ${route.name} (${route.path})`);
    return { ...route, status, success: status === 200 };
  } catch (error) {
    console.log(`❌ ERROR - ${route.name} (${route.path}): ${error.message}`);
    return { ...route, status: 'ERROR', success: false, error: error.message };
  }
}

async function testAllRoutes() {
  console.log('\n🧪 Testing All Routes...\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const route of routes) {
    const result = await testRoute(route);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  console.log('='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`Total Routes: ${results.length}`);
  console.log(`✅ Success: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed Routes:');
    failed.forEach(r => console.log(`  - ${r.name} (${r.path})`));
  }
  
  console.log('\n✨ Testing Complete!\n');
}

// Run tests
testAllRoutes().catch(console.error);
