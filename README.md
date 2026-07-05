# Next Scaffold

A Next.js app scaffold with **TanStack Query**, **Axios**, **NextAuth** credentials login, and route-level authentication via a `proxy` middleware.

## Prerequisites

- Node.js >= 20.9.0
- An API backend that exposes `/auth/login` and `/auth/session-details`

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
NEXTAUTH_SECRET=your_random_secret_key
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
API_BASE_URL=https://api.example.com
```

| Variable | Description |
| --- | --- |
| `NEXTAUTH_SECRET` | Secret used by NextAuth to sign JWTs and session tokens. |
| `NEXT_PUBLIC_API_BASE_URL` | Public API base URL used by the browser-side Axios client. |
| `API_BASE_URL` | Server-side API base URL used by the Next.js server. |

## Installation

Install dependencies:

```bash
npm install
```

## Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Build the production app. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint. |

## Project Structure

- `app/api/auth/[...nextauth]/route.ts` — NextAuth credentials handler.
- `src/config/api-client.ts` — Axios instance configuration.
- `src/shared/api/client.ts` — `requestApi` wrapper around Axios.
- `src/providers/` — TanStack Query and NextAuth `SessionProvider` wrappers.
- `src/features/auth/api/index.ts` — `useLogin` and `useUser` hooks.
- `src/features/auth/types/index.d.ts` — Auth types and NextAuth module augmentation.
- `proxy.ts` / `middleware.ts` — Route guard that redirects unauthenticated users to `/login`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Axios Documentation](https://axios-http.com/)
