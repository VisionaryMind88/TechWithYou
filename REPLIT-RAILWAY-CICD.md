# Setting Up CI/CD from Replit to Railway

This guide will help you establish a continuous integration and deployment (CI/CD) pipeline from your Replit development environment to Railway hosting.

## Option 1: GitHub Integration (Recommended)

This approach uses GitHub as an intermediary to connect Replit and Railway.

### Step 1: Configure Replit with GitHub

1. In your Replit project, go to the "Version Control" tab in the left sidebar
2. If you haven't already, initialize Git for your project
3. Connect to GitHub by clicking "Connect to GitHub"
4. Create a new repository or select an existing one
5. Commit and push your code to GitHub

### Step 2: Configure GitHub for Automatic Deployments

Create a GitHub Actions workflow file to automate deployments:

1. In your Replit project, create a new file at `.github/workflows/deploy.yml`
2. Add the following content:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Install Railway CLI
        run: npm i -g @railway/cli

      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Step 3: Set Up Railway Token

1. Generate a Railway token:
   - Go to [Railway dashboard](https://railway.app/account)
   - Click on "Developer" tab
   - Generate a new token

2. Add the token to GitHub secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: Your Railway token
   - Click "Add secret"

### Step 4: Connect Railway to GitHub

1. In Railway dashboard, create a new project
2. Select "Deploy from GitHub repo"
3. Connect to GitHub and select your repository
4. Configure build and start commands:
   - Build Command: `npm run build`
   - Start Command: `npm run start`

### Step 5: Work with the CI/CD Pipeline

Now, your workflow will be:

1. Make changes in Replit
2. Commit and push to GitHub using the Version Control panel
3. GitHub Actions will automatically deploy your changes to Railway
4. Monitor the deployment in the Railway dashboard

## Option 2: Direct Railway CLI Integration

If you prefer not to use GitHub, you can deploy directly from Replit to Railway.

### Step 1: Install Railway CLI in Replit

Run this command in your Replit Shell:

```bash
npm install -g @railway/cli
```

### Step 2: Log in to Railway

```bash
railway login
```

This will open a browser window where you can authenticate with Railway.

### Step 3: Link Your Replit Project to Railway

```bash
railway link
```

Select your Railway project when prompted.

### Step 4: Deploy Manually

Whenever you want to deploy your changes:

```bash
railway up
```

## Option 3: Set Up a Custom Deploy Script

Create a shell script in your Replit project to automate deployments:

1. Create a file named `deploy.sh`:

```bash
#!/bin/bash

# Build the application
npm run build

# Deploy to Railway
railway up
```

2. Make it executable:

```bash
chmod +x deploy.sh
```

3. Run the script whenever you want to deploy:

```bash
./deploy.sh
```

## Ensuring Database Synchronization

To ensure your database changes are synchronized properly:

1. Use Drizzle migrations:
   - Run `npm run db:push` to update your schema
   - Commit migration files to your repository

2. Ensure your Railway environment has the correct `DATABASE_URL`:
   - The same Supabase PostgreSQL database should be used in both environments
   - This ensures data consistency between Replit and Railway

## Testing the Deployment

After setting up CI/CD, verify that:

1. Changes made in Replit are reflected in the Railway deployment
2. Database operations work correctly in both environments
3. File uploads to Firebase/Supabase work in the Railway environment
4. Authentication flows work end-to-end

## Troubleshooting

If deployments are failing:

1. Check GitHub Actions logs for errors
2. Verify Railway environment variables are correctly set
3. Ensure all dependencies are properly listed in package.json
4. Check for any Railway-specific configuration issues in railway.toml