# Auction House

## Project info

Auction House is a web marketplace for live auctions built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS.

## Local development

Install dependencies and start the frontend server:

```sh
npm install
npm run dev
```

## Backend setup

Configure your backend `.env` file and run the server from the `backend` folder.

Make sure the backend has:

- `MONGODB_URI` or `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRE`
- `JWT_REFRESH_EXPIRE`

## Deployment

Before building the frontend, set `VITE_API_BASE_URL` to your deployed backend origin.

For example:

```env
VITE_API_BASE_URL=https://your-backend.example.com
```

Build the app for production with:

```sh
npm run build
```

Then deploy the generated `dist` folder to your hosting provider.

## Custom domain

Connect a custom domain through your hosting platform settings.
