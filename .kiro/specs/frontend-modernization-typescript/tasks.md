# Implementation Plan: Frontend Modernization with TypeScript

## Overview

This implementation plan follows an incremental migration approach to modernize the LMS Kampus frontend application. The migration is structured in 4 phases, prioritizing critical production fixes first, then establishing TypeScript infrastructure, migrating all pages, and finally implementing testing and optimization.

The plan addresses:
- Critical Radix UI Slot composition errors causing 500 errors
- Migration from JavaScript to TypeScript with strict type safety
- Upgrade to Next.js 15 and React 19
- Implementation of error boundaries and testing infrastructure
- Performance optimization and documentation

## Tasks

### Phase 1: Critical Fixes and Foundation (Priority: CRITICAL)

- [x] 1. Upgrade Next.js and React dependencies
  - Upgrade Next.js to version 15.x in frontend/package.json
  - Upgrade React to version 19.x in frontend/package.json
  - Upgrade React DOM to version 19.x
  - Run `npm install` to update dependencies
  - Test application startup with `npm run dev`
  - Fix any breaking changes from the upgrade
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Fix Button component Slot composition errors
  - [x] 2.1 Implement Button component fix for asChild pattern
    - Modify frontend/components/ui/button.jsx to handle Slot composition correctly
    - Implement early return pattern when asChild=true to prevent multiple children
    - Ensure loading spinner only renders when asChild=false
    - Add JSDoc comments documenting asChild behavior and loading prop limitation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 2.2 Write unit tests for Button component
    - Test Button renders children correctly
    - Test Button handles click events
    - Test Button shows loading spinner when loading=true and asChild=false
    - Test Button does not show loading spinner when asChild=true
    - Test Button applies variant classes correctly
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3. Fix Select component Slot composition errors
  - Review frontend/components/ui/select.jsx for Slot composition issues
  - Fix any multiple children issues in Select components
  - Ensure SelectTrigger, SelectContent, SelectItem work correctly
  - Test Select component in pages that use it
  - _Requirements: 4.1, 4.6_

- [x] 4. Implement error boundaries
  - [x] 4.1 Create root error boundary
    - Create frontend/app/error.tsx with Error component
    - Implement error logging to console
    - Display user-friendly error message in Indonesian
    - Add "Coba Lagi" (Try Again) and "Kembali ke Beranda" (Go Home) buttons
    - Include error digest display if available
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 4.2 Create error boundary for (auth) route group
    - Create frontend/app/(auth)/error.tsx
    - Implement auth-specific error handling
    - Add recovery actions appropriate for auth pages
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 4.3 Create error boundary for (student) route group
    - Create frontend/app/(student)/error.tsx
    - Implement student-specific error handling
    - Add "Kembali ke Dashboard" button
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 4.4 Create error boundary for (instructor) route group
    - Create frontend/app/(instructor)/error.tsx
    - Implement instructor-specific error handling
    - Add appropriate recovery actions
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 4.5 Create error boundary for (admin) route group
    - Create frontend/app/(admin)/error.tsx
    - Implement admin-specific error handling
    - Add appropriate recovery actions
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 5. Checkpoint - Test critical fixes
  - Test all pages load without Slot composition errors
  - Test Button component with asChild prop in various scenarios
  - Test Select component functionality
  - Test error boundaries by triggering errors
  - Verify application stability
  - Ensure all tests pass, ask the user if questions arise

### Phase 2: Core Infrastructure Migration (Priority: HIGH)

- [x] 6. Setup TypeScript configuration
  - [x] 6.1 Create tsconfig.json with strict mode
    - Create frontend/tsconfig.json with strict type checking enabled
    - Configure compiler options: target ES2022, module esnext, jsx preserve
    - Enable all strict mode flags: strict, noUncheckedIndexedAccess, noImplicitAny, etc.
    - Configure path aliases: @/*, @/components/*, @/lib/*, @/types/*, @/hooks/*, @/app/*
    - Set up Next.js plugin configuration
    - _Requirements: 2.2, 2.3, 10.1, 10.2, 10.3, 10.4_
  
  - [x] 6.2 Install TypeScript dependencies
    - Install typescript, @types/react, @types/react-dom, @types/node
    - Update package.json with TypeScript-related scripts
    - Add type-check script: "type-check": "tsc --noEmit"
    - _Requirements: 2.1, 10.5, 10.6_

- [-] 7. Generate Supabase TypeScript types
  - [x] 7.1 Generate database types from Supabase schema
    - Run `supabase gen types typescript --local > frontend/lib/database.types.ts`
    - Verify generated types include all tables: users, courses, enrollments, etc.
    - Verify generated types include Row, Insert, Update types for each table
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 7.2 Create type helper utilities
    - Create frontend/types/api.ts with helper types
    - Implement Tables<T> helper type to extract table row types
    - Create ApiResponse<T> and ApiError interfaces
    - Create PaginatedResponse<T> interface
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.2, 8.6_

- [-] 8. Migrate utility files to TypeScript
  - [x] 8.1 Migrate lib/utils.js to TypeScript
    - Rename frontend/lib/utils.js to frontend/lib/utils.ts
    - Add TypeScript types to cn() function
    - Add types to any other utility functions
    - Update imports in files that use utils
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.3_
  
  - [x] 8.2 Create error handling utilities
    - Create frontend/lib/api-error.ts with ApiError class
    - Implement fromSupabaseError static method
    - Create frontend/lib/error-logger.ts with logError function
    - Create frontend/lib/error-messages.ts with ERROR_MESSAGES constant
    - Implement getErrorMessage function
    - _Requirements: 8.6, 9.4_

- [ ] 9. Migrate Supabase client files to TypeScript
  - [x] 9.1 Migrate lib/supabase/client.js to TypeScript
    - Rename frontend/lib/supabase/client.js to client.ts
    - Import Database type from database.types.ts
    - Type createClient function to return SupabaseClient<Database>
    - Update all imports of this file
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 9.2 Migrate lib/supabase/server.js to TypeScript
    - Rename frontend/lib/supabase/server.js to server.ts
    - Import Database type from database.types.ts
    - Type createClient function to return SupabaseClient<Database>
    - Update all imports of this file
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 9.3 Migrate lib/supabase/middleware.js to TypeScript
    - Rename frontend/lib/supabase/middleware.js to middleware.ts
    - Import Database type from database.types.ts
    - Add proper TypeScript types to middleware functions
    - Update all imports of this file
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 10. Create type definitions for common patterns
  - [x] 10.1 Create domain model types
    - Create frontend/types/models/user.ts with User, UserProfile, AuthUser interfaces
    - Create frontend/types/models/course.ts with Course, CourseWithInstructor, CourseWithStats interfaces
    - Create frontend/types/models/enrollment.ts with Enrollment, EnrollmentWithCourse interfaces
    - _Requirements: 2.4, 2.5, 9.1, 9.2, 9.3_
  
  - [x] 10.2 Create form schema types
    - Create frontend/types/forms.ts with Zod schemas
    - Define loginSchema and LoginFormData type
    - Define registerSchema and RegisterFormData type
    - Define courseSchema and CourseFormData type
    - _Requirements: 2.4, 2.5, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_
  
  - [x] 10.3 Create global type declarations
    - Create frontend/types/global.d.ts with ProcessEnv interface
    - Create frontend/types/next.d.ts with Next.js type augmentations
    - Create frontend/types/utils.ts with utility types (DeepPartial, RequireFields, etc.)
    - _Requirements: 2.4, 2.5, 10.1, 10.2, 10.3_

- [x] 11. Migrate UI components to TypeScript
  - [x] 11.1 Migrate button.jsx to button.tsx
    - Rename frontend/components/ui/button.jsx to button.tsx
    - Define ButtonProps interface extending React.ButtonHTMLAttributes
    - Add VariantProps from class-variance-authority
    - Add JSDoc comments for asChild and loading props
    - Export ButtonProps interface
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [x] 11.2 Migrate select.jsx to select.tsx
    - Rename frontend/components/ui/select.jsx to select.tsx
    - Define SelectTriggerProps, SelectContentProps, SelectItemProps interfaces
    - Type all Select component exports properly
    - Export all prop interfaces
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [x] 11.3 Migrate remaining UI components to TypeScript
    - Migrate frontend/components/ui/card.jsx to card.tsx with CardProps interface
    - Migrate frontend/components/ui/input.jsx to input.tsx with InputProps interface
    - Migrate frontend/components/ui/label.jsx to label.tsx with LabelProps interface
    - Migrate frontend/components/ui/badge.jsx to badge.tsx with BadgeProps interface
    - Migrate frontend/components/ui/progress.jsx to progress.tsx with ProgressProps interface
    - Migrate frontend/components/ui/skeleton.jsx to skeleton.tsx with SkeletonProps interface
    - Migrate frontend/components/ui/textarea.jsx to textarea.tsx with TextareaProps interface
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 12. Migrate feature components to TypeScript
  - Migrate frontend/components/course-card.jsx to course-card.tsx
  - Migrate frontend/components/navbar.jsx to navbar.tsx
  - Migrate frontend/components/empty-state.jsx to empty-state.tsx
  - Migrate frontend/components/loading-spinner.jsx to loading-spinner.tsx
  - Add proper TypeScript interfaces for all component props
  - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 13. Checkpoint - Verify core infrastructure
  - Run `npm run type-check` to verify no TypeScript errors
  - Test that all UI components render correctly
  - Test Supabase client connections work
  - Verify generated types are correct
  - Ensure all tests pass, ask the user if questions arise

### Phase 3: Page Migration (Priority: MEDIUM)

- [x] 14. Migrate authentication pages
  - [x] 14.1 Migrate (auth) route group pages
    - Migrate frontend/app/(auth)/login/page.js to page.tsx
    - Migrate frontend/app/(auth)/register/page.js to page.tsx
    - Migrate frontend/app/(auth)/demo/page.jsx to page.tsx
    - Add proper TypeScript types for page props (params, searchParams)
    - Type all form handlers and state variables
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 14.2 Write integration tests for auth pages
    - Test login page renders correctly
    - Test register page renders correctly
    - Test form validation works
    - Test error messages display correctly
    - _Requirements: 2.1, 2.4, 2.5, 17.4, 17.5_

- [-] 15. Migrate student pages
  - [x] 15.1 Migrate student dashboard and profile pages
    - Migrate frontend/app/(student)/student/page.js to page.tsx
    - Migrate frontend/app/(student)/student/profile/page.jsx to page.tsx
    - Migrate frontend/app/(student)/student/my-courses/page.jsx to page.tsx
    - Migrate frontend/app/(student)/student/certificates/page.jsx to page.tsx
    - Add proper TypeScript types for all page props
    - Type all data fetching and state management
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 15.2 Migrate student course pages
    - Migrate frontend/app/(student)/student/courses/[slug]/learn/page.jsx to page.tsx
    - Migrate frontend/app/(student)/student/quiz/[id]/page.jsx to page.tsx
    - Migrate frontend/app/(student)/student/quiz/[id]/result/[attemptId]/page.jsx to page.tsx
    - Add proper TypeScript types for dynamic route params
    - Type all course and quiz data
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 16. Migrate instructor pages
  - [ ] 16.1 Migrate instructor dashboard and course management
    - Migrate frontend/app/(instructor)/instructor/page.js to page.tsx
    - Migrate frontend/app/(instructor)/instructor/courses/new/page.jsx to page.tsx
    - Migrate frontend/app/(instructor)/instructor/courses/[id]/edit/page.jsx to page.tsx
    - Migrate frontend/app/(instructor)/instructor/courses/[id]/students/page.jsx to page.tsx
    - Migrate frontend/app/(instructor)/instructor/courses/[id]/analytics/page.jsx to page.tsx
    - Add proper TypeScript types for all page props and params
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 16.2 Migrate instructor quiz and live class pages
    - Migrate frontend/app/(instructor)/instructor/quizzes/new/page.jsx to page.tsx
    - Migrate frontend/app/(instructor)/instructor/live-classes/page.jsx to page.tsx
    - Add proper TypeScript types for all page props
    - Type all form handlers and data structures
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 17. Migrate admin pages
  - Migrate frontend/app/(admin)/admin/page.jsx to page.tsx
  - Migrate frontend/app/(admin)/admin/users/page.jsx to page.tsx
  - Migrate frontend/app/(admin)/admin/reports/page.jsx to page.tsx
  - Migrate frontend/app/(admin)/admin/settings/page.jsx to page.tsx
  - Add proper TypeScript types for all page props
  - Type all admin-specific data structures
  - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 18. Migrate public pages
  - [ ] 18.1 Migrate root and course pages
    - Migrate frontend/app/page.js to page.tsx
    - Migrate frontend/app/layout.js to layout.tsx
    - Migrate frontend/app/providers.js to providers.tsx
    - Migrate frontend/app/courses/page.jsx to page.tsx
    - Migrate frontend/app/courses/[slug]/page.jsx to page.tsx
    - Add proper TypeScript types for all page props
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 18.2 Migrate middleware
    - Migrate frontend/middleware.js to middleware.ts
    - Add proper TypeScript types for NextRequest and NextResponse
    - Type all middleware functions
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2_

- [ ] 19. Remove JavaScript configuration files
  - Delete frontend/jsconfig.json (replaced by tsconfig.json)
  - Verify no .js or .jsx files remain in app/, components/, lib/, or types/ directories
  - Update any remaining imports that reference .js/.jsx extensions
  - _Requirements: 2.3, 3.3, 3.4, 3.5_

- [ ] 20. Checkpoint - Verify complete TypeScript migration
  - Run `npm run type-check` to verify zero TypeScript errors
  - Run `npm run build` to verify production build succeeds
  - Test all pages load correctly in development
  - Test all pages load correctly in production build
  - Verify no console errors in browser
  - Ensure all tests pass, ask the user if questions arise

### Phase 4: Testing and Optimization (Priority: MEDIUM)

- [ ] 21. Setup testing infrastructure
  - [ ] 21.1 Configure Vitest for unit testing
    - Create frontend/vitest.config.ts with jsdom environment
    - Create frontend/vitest.setup.ts with testing-library setup
    - Install vitest, @testing-library/react, @testing-library/jest-dom
    - Mock Next.js router in vitest.setup.ts
    - Add test scripts to package.json
    - _Requirements: 11.1, 11.2, 11.4, 11.5, 11.6_
  
  - [ ] 21.2 Configure Playwright for E2E testing
    - Create frontend/playwright.config.ts
    - Configure test directory as ./e2e
    - Configure projects for chromium, firefox, webkit
    - Set up webServer to run dev server
    - Add E2E test scripts to package.json
    - _Requirements: 11.3, 11.4, 11.5, 11.6_

- [ ] 22. Write example tests
  - [ ]* 22.1 Write example unit tests
    - Create frontend/lib/__tests__/utils.test.ts with tests for cn(), formatDate(), formatDuration()
    - Create frontend/components/ui/__tests__/button.test.tsx with Button component tests
    - Create frontend/components/ui/__tests__/card.test.tsx with Card component tests
    - _Requirements: 11.1, 11.2, 11.4, 11.5, 11.6_
  
  - [ ]* 22.2 Write example E2E tests
    - Create frontend/e2e/auth.spec.ts with authentication flow tests
    - Create frontend/e2e/enrollment.spec.ts with course enrollment flow tests
    - Test login, registration, course browsing, and enrollment flows
    - _Requirements: 11.3, 11.4, 11.5, 11.6_

- [ ] 23. Implement performance optimizations
  - [ ] 23.1 Configure bundle analysis
    - Install @next/bundle-analyzer
    - Add analyze script to package.json
    - Configure withBundleAnalyzer in next.config.js
    - Run bundle analysis and document results
    - _Requirements: 12.7_
  
  - [ ] 23.2 Optimize images
    - Audit all image usage in components
    - Ensure all images use Next.js Image component
    - Configure remotePatterns in next.config.js for Supabase storage
    - Set appropriate sizes prop for responsive images
    - _Requirements: 12.4_
  
  - [ ] 23.3 Implement code splitting for heavy components
    - Identify heavy components (video player, PDF viewer, rich text editor)
    - Use dynamic imports with loading states
    - Configure ssr: false for client-only components
    - _Requirements: 12.5, 12.6_

- [ ] 24. Update documentation
  - [ ] 24.1 Update README with TypeScript information
    - Document TypeScript setup and configuration
    - Document path aliases and how to use them
    - Document type generation from Supabase
    - Document testing setup and how to run tests
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_
  
  - [ ] 24.2 Document component usage patterns
    - Document Button component asChild pattern and limitations
    - Document Select component usage
    - Document form validation with Zod and react-hook-form
    - Document Supabase client usage with TypeScript
    - _Requirements: 4.7, 20.4_
  
  - [ ] 24.3 Create migration guide
    - Document the migration process and lessons learned
    - Document common TypeScript patterns used in the codebase
    - Document troubleshooting tips for common issues
    - Document rollback procedures if needed
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 25. Final checkpoint - Production readiness
  - Run full test suite: `npm run test` and `npm run test:e2e`
  - Run type check: `npm run type-check`
  - Run production build: `npm run build`
  - Verify bundle size meets targets (< 200KB gzipped initial bundle)
  - Test all critical user flows manually
  - Verify performance metrics (FCP < 1.5s, TTI < 3s)
  - Review and merge all changes
  - Deploy to production
  - Monitor for errors in production
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Phase 1 (Critical Fixes) should be deployed to production immediately to fix Slot errors
- Phases 2-4 can be deployed incrementally as they are completed
- All TypeScript migration maintains 100% backward compatibility with existing Supabase backend
- No database schema changes are required for this migration
