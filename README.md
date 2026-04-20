# DormEx

DormEx is a student-focused housing platform for discovering, publishing, and reviewing rental and sublet listings near universities.

The product is designed for students, international students, and young renters who need a more focused way to find campus-adjacent housing. DormEx keeps the first version intentionally simple: users can browse approved listings, publish housing information, upload listing photos, and contact publishers, while administrators review new submissions before they become public.

## Key Features

- Browse approved rental and sublet listings near universities
- Filter listings by school, budget, rental type, distance, and price priority
- Publish rental or sublet information through a guided listing form
- Upload local listing images through Supabase Storage
- Register and log in with email and password
- Protect publishing, profile, and admin pages behind authentication
- Review submitted listings through an administrator workflow
- Keep unapproved or removed listings hidden from the public marketplace

## Product Flow

For renters:

1. Open DormEx and choose the housing search path.
2. Browse approved listings by school, rental type, price, and distance.
3. Open a listing detail page to view photos, rent, location, timing, and publisher contact information.
4. Contact the publisher if the listing is relevant.

For publishers:

1. Create an account or log in.
2. Submit rental or sublet information with photos and contact details.
3. The listing enters a review state.
4. Once approved by an administrator, the listing appears in the public housing list.

For administrators:

1. Log in with an authorized administrator account.
2. Review pending listings.
3. Approve, reject, flag, or remove listings to maintain marketplace quality.

## Tech Stack

- Framework: Next.js
- UI: React and Tailwind CSS
- Database: Supabase Postgres
- ORM: Prisma
- Authentication: Email and password with server-side session cookies
- Image Storage: Supabase Storage
- Deployment Target: Vercel

## Project Structure

```text
app/              Application routes, pages, and API endpoints
components/       Reusable UI components
lib/              Database, authentication, session, and utility logic
prisma/           Prisma schema and database helper scripts
public/           Static public assets
```

## Environment Variables

Create a local `.env` file based on `.env.example`.

Required variables:

```env
DATABASE_URL="your-supabase-postgres-connection-string"
ADMIN_EMAIL_WHITELIST="admin@example.com"
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
SUPABASE_STORAGE_BUCKET="listing-images"
```

Never commit `.env` or real production credentials to GitHub. Use the deployment platform's environment variable settings for production.

## Local Development

Install dependencies, generate the Prisma client, synchronize the database schema, and start the local development server.

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

If you want to populate the school dropdown with the bundled school list without resetting listings, run:

```bash
npm run db:seed-schools
```

## Deployment

DormEx is designed to deploy cleanly on Vercel with Supabase as the hosted database and storage provider.

Recommended deployment setup:

- Push the repository to GitHub.
- Import the GitHub repository into Vercel.
- Add the required environment variables in Vercel.
- Keep Supabase Postgres as the production database.
- Use Supabase Storage for listing images.
- Configure an administrator account and whitelist before launch.

## Status

DormEx is currently an MVP. The core listing, publishing, authentication, image upload, and review flows are implemented, while future versions can expand into richer search, school management, messaging, and verification workflows.
