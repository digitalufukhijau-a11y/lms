# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-19

### Added
- Initial project setup with Next.js 14 and Node.js
- Supabase integration for database and storage
- Complete authentication system (JWT with refresh tokens)
- Course management (CRUD operations)
- Chapter and lesson structure
- Enrollment system
- Progress tracking
- File upload to Supabase Storage
- User roles (Student, Instructor, Admin, Super Admin)
- Responsive UI with Tailwind CSS
- Docker support for local development
- Database schema with Prisma ORM
- API rate limiting
- Error handling middleware
- Logging with Winston
- Real-time support with Socket.io
- Landing page
- Login and registration pages
- Student dashboard
- Instructor dashboard
- Comprehensive documentation (SETUP.md, DEPLOYMENT.md)
- Setup scripts for quick start
- CI/CD pipeline with GitHub Actions

### Security
- Password hashing with bcrypt
- JWT token authentication
- Refresh token rotation
- CORS configuration
- Helmet security headers
- Input validation with Zod

## [Unreleased]

### Planned
- Quiz and assessment system
- Live class integration (Jitsi Meet)
- Certificate generation
- Email notifications
- In-app notifications
- Discussion forum
- Admin panel
- Analytics dashboard
- Mobile app (React Native)
- Payment integration

---

## Version History

- **v1.0.0** (2026-03-19) - Initial release with core features
