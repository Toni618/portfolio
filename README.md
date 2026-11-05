# Portfolio (Next.js + Three.js + Admin panel)

3D scroll-driven portfolio with a database and an admin panel.
Every text on the site (including the site name) and every skill/project is editable from `/admin`.

## Run locally (CachyOS / Arch)

```bash
sudo pacman -S --needed nodejs npm git github-cli zed
cd portfolio
cp .env.example .env.local     # then edit ADMIN_PASSWORD and AUTH_SECRET
npm install
npm run dev
```

- Site:  http://localhost:3000
- Admin: http://localhost:3000/admin

A local database file (`local.db`) is created automatically on first run.

## Where to change things in the code

| What | File |
|---|---|
| All editable texts (add a new one here and it appears in the admin) | `lib/settings.ts` |
| 3D scene (objects, colors, camera path, glow) | `components/Scene.tsx` |
| Colors of the whole site | `app/globals.css` (`@theme` block at the top) |
| Page layout / sections | `app/page.tsx` |
| Hero animation | `components/Hero.tsx` |
| Horizontal project scroll | `components/HScroll.tsx` |
| Admin panel | `app/admin/page.tsx`, `app/admin/actions.ts` |
| Database tables | `lib/db.ts` |

## Put it online

1. Push to GitHub:
   ```bash
   git init && git add . && git commit -m "first version"
   gh auth login
   gh repo create portfolio --public --source=. --push
   ```
2. Create a free database at https://turso.tech and copy `DATABASE_URL` and `DATABASE_AUTH_TOKEN`.
3. Import the repo at https://vercel.com and add 4 environment variables:
   `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `ADMIN_PASSWORD`, `AUTH_SECRET`.
4. Deploy. Changes made in `/admin` are live for everyone immediately.
   Code changes go live with every `git push`.

## Images

Use a full URL, or put the file in `public/images/` and write `/images/yourfile.jpg` in the admin.
