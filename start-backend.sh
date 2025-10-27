#!/bin/bash

# AfterSchool Hub Backend Startup Script

echo "🚀 Starting AfterSchool Hub Backend Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20.19.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js v20.19.0 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please update it with your configuration."
    else
        echo "❌ .env.example file not found. Please create .env file manually."
        exit 1
    fi
fi

# Check if database exists
if [ ! -f "config/database/afterschool_hub.db" ]; then
    echo "🌱 Database not found. Seeding database..."
    npm run seed
fi

# Start the server
echo "🚀 Starting server..."
npm run dev
