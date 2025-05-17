#!/bin/bash
# Script for automating Railway deployments from Replit

# Color codes for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Railway Deployment Automation ===${NC}"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

# Login to Railway if not already logged in
railway whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Please login to Railway:${NC}"
    railway login
fi

# Link to Railway project if not already linked
if [ ! -f .railway/config.json ]; then
    echo -e "${YELLOW}Linking to Railway project...${NC}"
    railway link
fi

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Please fix the errors before deploying.${NC}"
    exit 1
fi

# Test database connection before deployment
echo -e "${YELLOW}Testing database connection...${NC}"
node -e "
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Database connection successful!');
    pool.end();
  }
});"

if [ $? -ne 0 ]; then
    echo -e "${RED}Database connection failed! Please check your DATABASE_URL.${NC}"
    echo -e "${YELLOW}Do you want to continue with deployment anyway? (y/n)${NC}"
    read continue_deployment
    if [ "$continue_deployment" != "y" ]; then
        exit 1
    fi
fi

# Deploy to Railway
echo -e "${YELLOW}Deploying to Railway...${NC}"
railway up

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    
    # Get the deployment URL
    deploy_url=$(railway variables list | grep RAILWAY_PUBLIC_DOMAIN | cut -d '=' -f2 | tr -d ' ')
    
    if [ -n "$deploy_url" ]; then
        echo -e "${GREEN}Your application is deployed at: https://$deploy_url${NC}"
    else
        echo -e "${GREEN}Your application is deployed. Check the Railway dashboard for details.${NC}"
    fi
    
    echo -e "${YELLOW}Testing deployed application health...${NC}"
    if curl -s "https://$deploy_url/api/health" | grep -q "healthy"; then
        echo -e "${GREEN}Health check passed!${NC}"
    else
        echo -e "${RED}Health check failed. Please check your logs in the Railway dashboard.${NC}"
    fi
else
    echo -e "${RED}Deployment failed! Please check the error message above.${NC}"
fi