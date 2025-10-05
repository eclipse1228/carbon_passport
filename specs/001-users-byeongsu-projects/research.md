# Research Documentation: Carbon Passport Technical Decisions

## 1. Supabase Row Level Security (RLS) for Passport Data

### Decision

Use Supabase RLS policies with share_hash for public access and session-based access for creators.

### Rationale

- Provides database-level security without additional middleware
- Share links can access specific passports via hash without authentication
- Automatic enforcement of 30-day expiration through expires_at column
- No user authentication required for MVP

### Implementation Strategy

```sql
-- Public read access via share_hash
CREATE POLICY "Public can view shared passports" ON passports
  FOR SELECT USING (
    share_hash IS NOT NULL
    AND expires_at > NOW()
  );

-- Anonymous creation allowed
CREATE POLICY "Anyone can create passport" ON passports
  FOR INSERT WITH CHECK (true);
```

### Alternatives Considered

- JWT-based authentication: Overkill for anonymous passport creation
- API key validation: Adds unnecessary complexity for MVP
- Session storage only: No persistence, loses data on browser close

## 2. React-Leaflet Mobile Optimization

### Decision

Implement lazy loading with dynamic imports and use lighter tile providers for mobile.

### Rationale

- Reduces initial bundle size by ~200KB
- Mobile devices get optimized map tiles with less detail
- Touch gesture optimizations improve UX on small screens

### Implementation Strategy

```typescript
// Dynamic import for map component
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => <MapSkeleton />
});

// Mobile detection and optimization
const tileUrl = isMobile
  ? 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
```

### Alternatives Considered

- Mapbox GL JS: More powerful but requires API key and costs
- Google Maps: Expensive for commercial use
- Static map images: Poor UX, no interactivity

## 3. Browser-Side Image Compression

### Decision

Use browser-canvas-compress library with WebP output when supported.

### Rationale

- Reduces upload size by 60-80% without visible quality loss
- WebP provides better compression than JPEG
- Falls back to JPEG for older browsers
- Works entirely client-side, no server processing needed

### Implementation Strategy

```typescript
import { compress } from 'browser-image-compression'

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/webp',
  }
  return await compress(file, options)
}
```

### Alternatives Considered

- Server-side compression: Increases bandwidth usage, slower UX
- No compression: Large files slow down uploads and storage
- Custom canvas manipulation: More complex, reinventing the wheel

## 4. Internationalization with Next.js App Router

### Decision

Use next-intl with middleware-based locale detection and URL routing.

### Rationale

- Built for App Router with RSC support
- Automatic locale detection from browser
- URL-based routing (/ko, /en, /ja, /zh) for SEO
- Type-safe translations with TypeScript

### Implementation Strategy

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ko', 'en', 'ja', 'zh'],
  defaultLocale: 'ko',
  localeDetection: true
});

// app/[locale]/layout.tsx
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

### Alternatives Considered

- next-i18next: Doesn't fully support App Router
- react-intl: More complex setup, less Next.js integration
- Custom solution: Time-consuming, prone to bugs

## 5. Share Link Generation and Expiration

### Decision

Generate UUID-based share_hash with database-enforced expiration.

### Rationale

- UUIDs are unguessable and unique
- Database handles expiration automatically
- No need for background jobs or cron tasks
- Simple to implement and maintain

### Implementation Strategy

```typescript
// API Route: /api/share
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  const { passportId } = await request.json()

  const shareHash = nanoid(12) // 12-char random string
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

  await supabase
    .from('passports')
    .update({
      share_hash: shareHash,
      expires_at: expiresAt.toISOString(),
    })
    .eq('id', passportId)

  return Response.json({
    shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/passport/${shareHash}`,
  })
}
```

### Alternatives Considered

- JWT tokens in URL: Too long, ugly URLs
- Redis for expiration: Additional infrastructure needed
- Encrypted passport data in URL: URL length limitations

## 6. Photo Storage Strategy

### Decision

Use Supabase Storage with public bucket for passport photos.

### Rationale

- Integrated with existing Supabase setup
- Automatic CDN distribution
- No additional service needed
- Simple permission model for public photos

### Implementation Strategy

```typescript
const uploadPhoto = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from('passport-photos').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (data) {
    const {
      data: { publicUrl },
    } = supabase.storage.from('passport-photos').getPublicUrl(fileName)

    return publicUrl
  }
}
```

### Alternatives Considered

- Cloudinary: Powerful but adds complexity and cost
- S3 direct upload: Requires AWS account and configuration
- Base64 in database: Poor performance, database bloat

## Summary of Technical Stack

| Category         | Technology                | Key Benefit                               |
| ---------------- | ------------------------- | ----------------------------------------- |
| Framework        | Next.js 14 App Router     | Server Components, built-in i18n routing  |
| Database         | Supabase (PostgreSQL)     | RLS policies, integrated storage          |
| UI Components    | shadcn/ui                 | Customizable, accessible, modern          |
| State Management | Zustand + React Query     | Simple client state, server state caching |
| Maps             | React-Leaflet             | Free, customizable, mobile-friendly       |
| i18n             | next-intl                 | App Router support, type-safe             |
| Image Processing | browser-image-compression | Client-side, WebP support                 |
| Styling          | Tailwind CSS              | Utility-first, component-friendly         |
| Testing          | Jest + Playwright         | Unit/integration + E2E coverage           |
| Deployment       | Vercel                    | Optimized for Next.js, edge functions     |

All technical decisions prioritize simplicity, performance, and maintainability while meeting the MVP requirements.
