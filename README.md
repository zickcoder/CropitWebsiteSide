# cropitGIF Companion Website

Companion single-page website for the **cropitGIF** Chrome extension.

## Features

- Minimalist dark aesthetic matching the extension's UI (`#141416` background, `#F59E0B` amber accent)
- Interactive hero with live crop-frame simulation
- 3-step "how it works" strip
- ☕ Coffee/GCash QR donation modal
- 💡 Feature suggestion form with email OTP verification (Resend or Gmail SMTP)
- Suggestions saved to Supabase (with in-memory dev fallback)
- 🚧 Sponsor / Ads — Under Construction section
- Privacy Policy modal

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```env
# --- Email (choose one) ---

# Option A: Resend (recommended — free tier available)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=cropitGIF <no-reply@yourdomain.com>

# Option B: Gmail SMTP (App Password — not your regular password)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
EMAIL_FROM_NAME=cropitGIF

# --- Supabase (for storing suggestions) ---
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxx...
# OR for anon key (less secure — do not use service key on client)
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx...

# --- OTP signing secret (any long random string) ---
OTP_SECRET=your-random-secret-key-at-least-32-chars
```

> **Without any env vars set**, the site runs in **dev mock mode**: OTPs are logged to the terminal and shown in the UI, and suggestions are stored in memory (cleared on restart).

## Supabase Table

Run this SQL in your Supabase SQL editor:

```sql
create table if not exists suggestions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  suggestion text not null,
  created_at timestamptz default now()
);

-- Optional: row-level security (recommended)
alter table suggestions enable row level security;

-- Allow server-side inserts with service role key (no policy needed)
-- or if using anon key:
create policy "Allow insert from verified users"
  on suggestions for insert
  with check (true);
```

## Placing Your Real QR Code

Replace `/public/gcash-qr.svg` (placeholder) with your actual QR image at:

```
/public/gcash-qr.png
```

The app automatically shows the PNG if it exists, otherwise falls back to the SVG placeholder.

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel Project → Settings → Environment Variables
4. Deploy — no other config needed

```
cropitGIF • 100% Local & Private
```

