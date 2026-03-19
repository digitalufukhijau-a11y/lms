#!/bin/bash

echo "🚀 LMS Kampus - Quick Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Supabase credentials"
    echo ""
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Setup backend
echo "🔧 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
fi

npm install
echo "✅ Backend dependencies installed"
echo ""

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npm run prisma:generate
echo ""

# Ask if user wants to run migrations
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running migrations..."
    npm run prisma:migrate:deploy
    echo ""
    
    read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        npm run prisma:seed
        echo ""
    fi
fi

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -f .env ]; then
    cp .env.example .env
fi

npm install
echo "✅ Frontend dependencies installed"
echo ""

cd ..

echo "✅ Setup completed!"
echo ""
echo "📚 Next steps:"
echo "1. Edit .env files in root, backend/, and frontend/ with your credentials"
echo "2. Start development:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Or both: npm run dev (from root)"
echo ""
echo "3. Access the app:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo ""
echo "📖 Read SETUP.md for detailed instructions"
echo "🚀 Happy coding!"
