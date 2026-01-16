#!/bin/bash

# JobX Deployment Script
# Quick deployment to Vercel

echo "🚀 JobX Deployment Script"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo ""
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

echo -e "${BLUE}📦 Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    echo ""
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    echo ""

    # Ask for deployment type
    echo "Select deployment type:"
    echo "1) Preview deployment (test)"
    echo "2) Production deployment (live)"
    read -p "Enter choice (1 or 2): " choice

    case $choice in
        1)
            echo ""
            echo -e "${BLUE}Deploying preview...${NC}"
            vercel
            ;;
        2)
            echo ""
            echo -e "${BLUE}Deploying to production...${NC}"
            vercel --prod
            ;;
        *)
            echo -e "${RED}Invalid choice. Exiting.${NC}"
            exit 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
        echo ""
        echo "Your JobX app is now live!"
        echo "Check your terminal for the deployment URL"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi
