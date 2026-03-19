# Contributing to LMS Kampus

Terima kasih atas minat Anda untuk berkontribusi! 

## Development Workflow

1. Fork repository
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m 'Add: deskripsi fitur'`
4. Push to branch: `git push origin feature/nama-fitur`
5. Submit Pull Request

## Commit Message Convention

Gunakan format:
- `Add: ` untuk fitur baru
- `Fix: ` untuk bug fix
- `Update: ` untuk update fitur existing
- `Refactor: ` untuk refactoring code
- `Docs: ` untuk dokumentasi

Contoh:
```
Add: quiz timer functionality
Fix: enrollment duplicate error
Update: course card UI design
```

## Code Style

### Backend (Node.js)
- Use ES6+ syntax
- 2 spaces indentation
- Semicolons required
- Use async/await over promises
- Add JSDoc comments untuk functions

### Frontend (React)
- Use functional components
- Use hooks (useState, useEffect, etc)
- 2 spaces indentation
- Use Tailwind CSS untuk styling
- Component names: PascalCase
- File names: kebab-case

## Testing

Sebelum submit PR:
```bash
# Backend
cd backend
npm run lint
npm test

# Frontend
cd frontend
npm run lint
npm run build
```

## Pull Request Guidelines

- Update README jika menambah fitur baru
- Tambahkan tests untuk fitur baru
- Pastikan semua tests pass
- Update dokumentasi API jika ada perubahan endpoint
- Screenshot untuk perubahan UI

## Questions?

Buka issue atau hubungi maintainer.
