# LinkVault — MERN URL Shortener

A complete starter project for a URL-shortening app with a minimal flat 2D SVG press illustration, Framer Motion animations, a React frontend, Express API, and MongoDB persistence.

## Included

- Responsive React + Vite UI with white/off-white, charcoal, grey, orange-red and yellow palette
- Original React SVG illustration: input station, conveyor, press, URL card and package
- Framer Motion movement for the press piston, plate, card and package
- URL normalization and validation; generated short codes and optional custom aliases
- Short-link redirect route with click tracking
- Optional account for creating links; account dashboard requires sign-in
- JWT registration/login, bcrypt password hashing, protected routes
- Dashboard: saved links, click totals, daily activity, top links, search, copy, pause/resume and delete
- Optional expiry date API support
- Helmet security headers, CORS configuration, JSON body limits and API rate limits
- Health endpoint at `/health`

## Requirements

- Node.js 20 or newer recommended
- MongoDB running locally, or a MongoDB Atlas connection string

## Run locally

1. Unzip this folder and open a terminal in `linkvault-mern`.
2. Install the root tool and both app dependencies:

   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

3. Create the server environment file:

   ```bash
   cp server/.env.example server/.env
   ```

   On Windows PowerShell, use `Copy-Item server/.env.example server/.env`.

4. Edit `server/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. The default URI expects MongoDB on your own computer.
5. Start MongoDB.
6. Start frontend and backend from the root folder:

   ```bash
   npm run dev
   ```

7. Open **http://localhost:5173**. The API runs on **http://localhost:5000**.

If your API is hosted elsewhere, create `client/.env` with `VITE_API_URL=https://your-api.example.com/api`, and set the backend's `API_BASE_URL`, `CLIENT_URL`, and `MONGODB_URI` accordingly.

## API reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | API health check |
| POST | `/api/auth/register` | No | Create account (`name`, `email`, `password`) |
| POST | `/api/auth/login` | No | Login (`email`, `password`) |
| GET | `/api/auth/me` | Bearer token | Current user |
| POST | `/api/links` | Optional | Shorten (`url`, optional `customCode`, `title`, `expiresAt`) |
| GET | `/api/links` | Bearer token | List user's links (`page`, `limit`, `search`) |
| GET | `/api/links/analytics` | Bearer token | Click and link analytics |
| PATCH | `/api/links/:id/toggle` | Bearer token | Pause/resume a link |
| DELETE | `/api/links/:id` | Bearer token | Delete a link |
| GET | `/:code` | No | Track click and redirect to destination |

### Example: shorten a link

```bash
curl -X POST http://localhost:5000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/a/very/long/path"}'
```

The response includes a `shortUrl`, for example `http://localhost:5000/Ab3xYz`. Open it in a browser to count a click and redirect.

## Notes before production

This is a runnable full-stack starter, not a fully audited production deployment. Before launching publicly:

- Use HTTPS and a strong unique `JWT_SECRET`; never commit `.env` files.
- Set `CLIENT_URL` to your deployed frontend and `API_BASE_URL` to your deployed API origin.
- Add bot filtering/abuse detection, a blocklist for malicious destinations, CAPTCHA or stronger throttling as appropriate, and an abuse-reporting process.
- Consider moving click events to a separate collection or analytics store for high traffic; this starter retains up to 5,000 events per link.
- Expiry is stored with a MongoDB TTL index. MongoDB TTL cleanup is asynchronous, while the redirect route also checks expiry at request time.
- Guest-created links are anonymous and are not manageable from the dashboard. Sign in before creating links to attach them to your account.
- Click events currently record timestamp, referrer and user-agent. Country is left as `Unknown`; IP addresses are not stored.

## Project structure

```text
linkvault-mern/
  client/                 React + Vite frontend
    src/components/       Logo and animated SVG machine
    src/context/          Authentication context
    src/pages/            Authentication and analytics pages
    src/lib/api.js        Axios API client
    src/styles.css        Responsive design system
  server/                 Express REST API
    src/config/            MongoDB connection
    src/controllers/       Auth and link logic
    src/middleware/        JWT authentication
    src/models/            Mongoose models
    src/routes/            API routes
```
