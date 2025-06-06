#!/bin/bash

# Deployment Setup Script for Next.js + NestJS Monorepo
# This script helps you set up deployment to Vercel and Fly.io

set -e

echo "🚀 Setting up deployment for your monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_step "Checking requirements..."
    
    if ! command -v flyctl &> /dev/null; then
        print_error "Fly.io CLI not found. Install it from: https://fly.io/docs/hands-on/install-flyctl/"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Install it with: npm i -g vercel"
        echo "You can also deploy via GitHub integration without the CLI."
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm not found. Install it from: https://pnpm.io/installation"
        exit 1
    fi
    
    echo "✅ Requirements check complete"
}

# Setup Fly.io app
setup_flyio() {
    print_step "Setting up Fly.io for backend..."
    
    cd backend
    
    if [ ! -f "fly.toml" ]; then
        print_error "fly.toml not found in backend directory"
        exit 1
    fi
    
    echo "📝 Please update fly.toml with your app name and preferred region"
    echo "   Edit: backend/fly.toml"
    echo "   Change 'your-backend-app-name' to your actual app name"
    
    read -p "Press enter when you've updated the app name in fly.toml..."
    
    # Create the Fly.io app
    echo "Creating Fly.io app..."
    flyctl apps create
    
    # Set secrets
    echo "Setting up environment variables..."
    echo "You'll need to set these secrets in Fly.io:"
    echo "  - DATABASE_URL"
    echo "  - CLERK_SECRET_KEY"
    echo "  - Any other environment variables your backend needs"
    
    echo ""
    echo "Set them using:"
    echo "  flyctl secrets set DATABASE_URL=your_supabase_connection_string"
    echo "  flyctl secrets set CLERK_SECRET_KEY=your_clerk_secret"
    
    cd ..
}

# Setup Vercel project
setup_vercel() {
    print_step "Setting up Vercel for frontend..."
    
    cd frontend
    
    if command -v vercel &> /dev/null; then
        echo "Linking to Vercel project..."
        vercel link
        
        echo "Setting up environment variables..."
        echo "You'll need to set these in your Vercel dashboard:"
        echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
        echo "  - NEXT_PUBLIC_BACKEND_URL"
        echo "  - Any other frontend environment variables"
    else
        echo "Please:"
        echo "1. Go to https://vercel.com/dashboard"
        echo "2. Import your GitHub repository"
        echo "3. Set the root directory to 'frontend'"
        echo "4. Set the build command to: cd .. && pnpm nx build frontend"
        echo "5. Set the install command to: cd .. && pnpm install --frozen-lockfile"
    fi
    
    cd ..
}

# Setup GitHub secrets
setup_github_secrets() {
    print_step "GitHub Secrets Setup"
    
    echo "You need to set these secrets in your GitHub repository:"
    echo "Settings -> Secrets and variables -> Actions -> New repository secret"
    echo ""
    echo "Required secrets:"
    echo "  🔐 FLY_API_TOKEN - Get from: https://fly.io/user/personal_access_tokens"
    echo "  🔐 VERCEL_TOKEN - Get from: https://vercel.com/account/tokens"
    echo "  🔐 VERCEL_ORG_ID - Get from Vercel project settings"
    echo "  🔐 VERCEL_PROJECT_ID - Get from Vercel project settings"
    echo "  🔐 TEST_DATABASE_URL - For running tests (optional)"
    echo ""
    echo "Environment-specific secrets (if using GitHub environments):"
    echo "  🔐 DATABASE_URL - Your Supabase connection string"
    echo "  🔐 CLERK_SECRET_KEY - Your Clerk secret key"
    echo "  🔐 Any other production environment variables"
}

# Main execution
main() {
    echo "🏗️  Deployment Setup for Next.js + NestJS Monorepo"
    echo "=================================================="
    echo ""
    
    check_requirements
    echo ""
    
    # Ask what to set up
    echo "What would you like to set up?"
    echo "1) Fly.io (Backend)"
    echo "2) Vercel (Frontend)"
    echo "3) GitHub Secrets Info"
    echo "4) All of the above"
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            setup_flyio
            ;;
        2)
            setup_vercel
            ;;
        3)
            setup_github_secrets
            ;;
        4)
            setup_flyio
            echo ""
            setup_vercel
            echo ""
            setup_github_secrets
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Set up the required GitHub secrets"
    echo "3. Set up environment variables in Fly.io and Vercel"
    echo "4. Create a pull request to trigger the CI/CD pipeline"
    echo ""
    echo "📚 Useful commands:"
    echo "  - Deploy backend manually: cd backend && flyctl deploy"
    echo "  - Deploy frontend manually: cd frontend && vercel --prod"
    echo "  - View logs: flyctl logs (backend) or vercel logs (frontend)"
}

# Run main function
main "$@" 
