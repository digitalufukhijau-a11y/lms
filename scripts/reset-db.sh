#!/bin/bash

echo "⚠️  Database Reset Script"
echo "========================="
echo ""
echo "This will:"
echo "1. Drop all tables"
echo "2. Run migrations"
echo "3. Seed with sample data"
echo ""

read -p "Are you sure? This cannot be undone! (yes/no) " -r
echo ""

if [[ $REPLY != "yes" ]]; then
    echo "❌ Cancelled"
    exit 0
fi

cd backend

echo "🗑️  Resetting database..."
npx prisma migrate reset --force

echo ""
echo "✅ Database reset complete!"
echo ""
echo "Default credentials:"
echo "- Admin: admin@lms.edu / Password123!"
echo "- Dosen: dosen@lms.edu / Password123!"
echo "- Mahasiswa: mahasiswa@lms.edu / Password123!"
