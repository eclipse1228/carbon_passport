# Supabase Setup Guide

## Prerequisites
- Create a Supabase account at https://supabase.com
- Create a new project

## Setup Steps

### 1. Get Your Project Credentials
1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   projectUrl=https://edyujxoyckrcvupicknz.supabase.co
   - Anon Public Key (starts with: `eyJ...`)
Anon Public Key = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkeXVqeG95Y2tyY3Z1cGlja256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTE3NjAsImV4cCI6MjA3NTE2Nzc2MH0.Vfi_kz1gipaaR_ff4JCYYsMlOg02VU_XNwF-Bhb-_xw


### 2. Update Environment Variables 
Update your `.env.local` file with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Database Migrations
In your Supabase dashboard:

1. Go to SQL Editor
2. Create a new query
3. Copy and run each migration file in order:
   - `001_initial_schema.sql` - Creates tables and indexes
   - `002_seed_stations.sql` - Adds Korean railway stations
   - `003_rls_policies.sql` - Sets up Row Level Security
   - `004_storage_buckets.sql` - Creates storage bucket for photos

### 4. Verify Setup
Run each verification query in SQL Editor:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check stations are loaded
SELECT COUNT(*) as station_count FROM stations;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'passport-photos';
```

### 5. Test the Application
1. Run `npm run dev`
2. Navigate to http://localhost:3000
3. The app should connect to your Supabase instance

## Troubleshooting

### Connection Issues
- Verify your environment variables are set correctly
- Check that your Supabase project is not paused
- Ensure RLS policies are properly configured

### Migration Errors
- Run migrations in order (001, 002, 003, 004)
- If a migration fails, check for existing objects and drop them first
- Ensure UUID extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Storage Issues
- Verify the storage bucket was created
- Check that public access is enabled for the bucket
- Ensure file size limits are appropriate (default: 5MB)

## Security Notes

- The current setup uses public access for simplicity
- In production, consider implementing proper authentication
- Review and tighten RLS policies based on your requirements
- Consider implementing rate limiting and request validation

## Next Steps
- Test creating a passport through the app
- Verify image upload works correctly
- Test the share link functionality
- Monitor database performance and optimize queries as needed