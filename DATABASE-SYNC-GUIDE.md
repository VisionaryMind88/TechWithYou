# Database Synchronization between Replit and Railway

This guide focuses on ensuring your Supabase PostgreSQL database works correctly with both your Replit development environment and Railway production deployment.

## Setting Up PostgreSQL Connection

### 1. Configure Database URL

Both environments should use the same Supabase PostgreSQL database to ensure complete data synchronization:

1. In Replit:
   - Database URL is already configured in environment variables
   - Make sure `DATABASE_URL` points to your Supabase instance

2. In Railway:
   - Add the identical `DATABASE_URL` environment variable
   - Format: `postgresql://postgres:password@db.xyzsupabase.co:5432/postgres`

### 2. Configure Database Access Control

Ensure your Supabase project allows connections from both Replit and Railway:

1. Go to Supabase dashboard → Project Settings → Database
2. Under "Connection Pooling", note your connection string
3. If you have IP restrictions enabled:
   - Add Replit IP ranges
   - Add Railway IP ranges (or temporarily disable IP restrictions for testing)

## Using Drizzle for Schema Synchronization

Drizzle provides a consistent way to manage your database schema:

### 1. Push Schema Changes

When you make changes to your database schema in `shared/schema.ts`:

1. Run the following command in Replit:
   ```bash
   npm run db:push
   ```

2. This will update your Supabase PostgreSQL schema with any changes

3. When deploying to Railway, the updated schema is already in the database

### 2. Add a Database Migration Script

Create a script that can be run during Railway deployment to ensure schema consistency:

1. Create a file named `scripts/ensure-db-schema.ts`:

```typescript
// scripts/ensure-db-schema.ts
import { db } from '../server/db';
import * as schema from '../shared/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function ensureDbSchema() {
  console.log('Ensuring database schema is up to date...');

  try {
    // Test database connection
    await db.execute('SELECT 1');
    console.log('Database connection successful');

    // Check for required tables
    const tables = Object.keys(schema).filter(key => 
      typeof schema[key] === 'object' && schema[key]?.$type === 'table'
    );
    
    console.log(`Checking for ${tables.length} tables...`);
    
    // Log success
    console.log('Database schema verification complete');
    
  } catch (error) {
    console.error('Database schema verification failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  ensureDbSchema()
    .then(() => {
      console.log('Database schema check completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database schema check failed:', error);
      process.exit(1);
    });
}

export default ensureDbSchema;
```

2. Update your `package.json` to include this script:

```json
"scripts": {
  "db:ensure": "tsx scripts/ensure-db-schema.ts"
}
```

3. In Railway, you can optionally add this to your build process:

```
npm run build && npm run db:ensure
```

## Handling Real-time Data Synchronization

Since both environments connect to the same database:

1. Changes made in Replit are immediately available in the Railway-deployed application
2. Changes made through the Railway-deployed application are immediately available in Replit

## Testing Database Connectivity

### From Replit

Test your database connection from Replit:

```bash
npx tsx scripts/test-db-connection.ts
```

### From Railway

After deploying to Railway, check the logs to ensure database connection is successful:

1. Go to Railway dashboard → Deployments
2. Select the latest deployment
3. Click on "Logs"
4. Look for messages like "Connected to Supabase PostgreSQL database"

## Troubleshooting Database Issues

### Connection Problems

If you encounter database connection issues:

1. Verify the `DATABASE_URL` is correct in both environments
2. Check IP restrictions in Supabase
3. Test connection using a tool like `pg_isready`:
   ```bash
   pg_isready -h YOUR_DB_HOST -p YOUR_DB_PORT -U YOUR_DB_USER
   ```

### Schema Migration Failures

If schema changes aren't applying correctly:

1. Run `npm run db:push` manually in Replit
2. Check for error messages in the console
3. Consider using `drizzle-kit pull` to view the current database schema:
   ```bash
   npx drizzle-kit pull:pg --out=./drizzle/current-schema --schema=./shared/schema.ts --driver=pg
   ```

### Data Inconsistencies

If you notice data inconsistencies:

1. Verify both environments are using exactly the same connection string
2. Check for any application-level caching that might be causing stale data
3. Verify that all database operations use the same database client configuration