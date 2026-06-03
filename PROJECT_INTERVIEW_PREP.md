# Auction House Interview Prep

## 1. Project Overview

Auction House is a full-stack auction marketplace with a React + Vite frontend and an Express + MongoDB backend. The app supports:

- user registration/login
- JWT-based authentication
- buyer and seller roles
- live auctions with bid placement
- admin and seller dashboards
- product uploads and image serving

The frontend is built in `apex-auction-main/` and the backend is in `backend/`.

---

## 2. High-level Architecture

### Frontend

- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui components
- React Router DOM for page navigation
- React Query for data fetching and caching
- Axios for HTTP requests
- Local storage for JWT access/refresh tokens

### Backend

- Node.js + Express (ES modules)
- MongoDB Atlas via Mongoose
- JWT authentication with access and refresh tokens
- Multer for file uploads
- Helmet, CORS, rate limiting for security
- Deployment targeted for Render

### Deployment Flow

- Backend deployed on Render as a web service
- Frontend deployed on Vercel
- Frontend uses `VITE_API_BASE_URL` to point to backend origin
- Backend uses MongoDB connection string, JWT secrets, and other env vars

---

## 3. Repository Structure

### Root

- `apex-auction-main/` - frontend app
- `backend/` - backend server

### Frontend structure

- `src/`
  - `App.tsx` - root app and routing
  - `main.tsx` - React DOM mount
  - `pages/` - main pages (`Index`, `LiveAuction`, `Auth`, `SellerDashboard`, etc.)
  - `components/` - reusable UI and auction-specific components
  - `hooks/` - React Query hooks for API calls
  - `contexts/` - auth context for login state
  - `lib/api.ts` - axios wrapper and auth interceptors
  - `data/mockData.ts` - types and mock shapes

### Backend structure

- `server.js` - express setup, middleware, routes, DB connect
- `config/db.js` - MongoDB connection logic
- `controllers/` - route handlers
- `routes/` - express routers
- `models/` - Mongoose schemas
- `middleware/` - auth and error handling
- `utils/token.js` - JWT helpers
- `uploads/` - local uploaded files storage

---

## 4. Frontend Workflow

### Data flow

1. User visits pages handled by React Router.
2. React Query hooks call the API via `src/lib/api.ts`.
3. `api.ts` attaches `Authorization: Bearer <token>` from localStorage.
4. Successful responses populate component state and cache.
5. On bid placement, `useMutation` updates the cache and invalidates queries.

### Key frontend files

- `src/lib/api.ts`
  - builds base URL from `import.meta.env.VITE_API_BASE_URL`
  - adds access token to every request
  - handles 401 failures by calling `/api/auth/refresh-token`

- `src/hooks/useProduct.ts`
  - fetches single product details with polling enabled

- `src/hooks/useHomeProducts.ts`
  - fetches homepage auction listings with periodic refetch

- `src/hooks/useProductBids.ts`
  - fetches bid history for a product

- `src/pages/LiveAuction.tsx`
  - shows live auction details
  - places bids via `api.post('/products/:id/bid')`
  - updates local state and cache on success

### Auth handling on frontend

- `localStorage` stores `accessToken` and `refreshToken`
- `api.ts` intercepts responses with 401 to refresh the access token
- If refresh fails, the user is redirected to `/auth`

---

## 5. Backend Workflow

### Request handling

1. `server.js` loads env, connects to MongoDB, configures middleware.
2. Requests to `/api/*` are rate-limited and parsed as JSON.
3. Auth routes are mounted under `/api/auth`.
4. Product routes are mounted under `/api/products`.
5. Protected routes use `middleware/auth.js`.
6. Errors propagate to the custom `errorHandler`.

### Middleware

- `helmet` - security headers
- `cors` - enable cross-origin requests
- `express-rate-limit` - throttle API requests
- `express.json()` - parse JSON bodies
- `protect` in `backend/middleware/auth.js` - verify JWT access token

### Auth routes

- `POST /api/auth/register`
  - create user
  - hash password in `User.pre('save')`
  - return access and refresh tokens plus user data

- `POST /api/auth/login`
  - verify email and password
  - return access and refresh tokens

- `GET /api/auth/me`
  - protected route
  - returns logged-in user information

- `POST /api/auth/refresh-token`
  - verify refresh token using `JWT_REFRESH_SECRET`
  - issue new access token

### Product routes

- `POST /api/products/:id/bid`
  - protected route
  - validate auction is active and not ended
  - require new bid amount above current bid and starting price
  - create a `Bid` record
  - update `Product.currentBid`, `highestBidder`, `totalBids`

- `GET /api/products/home`
  - fetch home page items
  - used by homepage and live auction list

- `GET /api/products/:id/bids`
  - fetch bid history for a product

---

## 6. Data Models

### `User`

- `name`
- `email`
- `password` (hashed)
- `role`: `buyer | seller | admin`
- `sellerStatus`: `none | pending | approved | rejected`
- `isBlocked`

### `Product`

- `title`, `description`, `category`
- `startingPrice`
- `currentBid`
- `auctionEndTime`
- `images`
- `seller` reference
- `status`: `pending | approved | rejected`
- `isActive`
- `highestBidder`
- `totalBids`
- `winner`

### `Bid`

- `product` reference
- `bidder` reference
- `amount`
- `timestamp`

---

## 7. Environment Variables

### Backend `.env`

- `MONGODB_URI` or `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRE` (example: `15m`)
- `JWT_REFRESH_EXPIRE` (example: `7d`)
- `PORT` (optional)
- `NODE_ENV` (`development` | `production`)

### Frontend `.env` / Vercel env

- `VITE_API_BASE_URL=https://<your-backend-domain>`

#### Notes

- `VITE_` prefix is required for Vite to expose env vars to client code.
- `JWT_SECRET` is used for validating access tokens.
- `JWT_REFRESH_SECRET` is used for refresh token verification.
- `JWT_EXPIRE` controls how long access tokens last.
- `JWT_REFRESH_EXPIRE` controls how long refresh tokens last.

---

## 8. Auth and JWT Flow

### Access token flow

- User logs in/registers.
- Backend returns `accessToken` and `refreshToken`.
- Frontend stores tokens in `localStorage`.
- Requests attach `Authorization: Bearer <accessToken>`.
- Backend `protect` middleware verifies token using `JWT_SECRET`.
- If valid, `req.user` is attached and route continues.

### Refresh token flow

- If an API call returns 401, frontend interceptor attempts refresh.
- It calls `/api/auth/refresh-token` with the refresh token.
- If valid, backend issues a fresh access token.
- Frontend retries the failed request.
- If refresh is invalid, user is redirected to login.

---

## 9. Auction / Bid Workflow

### Bid placement

1. User enters a bid amount in `LiveAuction`.
2. Frontend validates amount locally.
3. Frontend calls `POST /api/products/:id/bid`.
4. Backend checks auction status and current bid.
5. Backend creates a `Bid` document.
6. Backend updates `Product.currentBid`, `highestBidder`, and `totalBids`.
7. Frontend updates local cache and bid history.

### Live update behavior

- The frontend uses React Query polling (`refetchInterval`) to refresh product and bid data every few seconds.
- This is a basic real-time strategy.
- A more advanced production solution would use WebSockets or a real-time push service.

---

## 10. Deployment Notes

### Frontend on Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Add env var `VITE_API_BASE_URL`
- If frontend deploy doesn’t show live data, confirm env var and redeploy.

### Backend on Render

- Set up a Web Service with `npm start`
- Add backend env vars in Render dashboard
- Use MongoDB Atlas as the database
- Ensure Atlas allows Render outbound IPs or use VPC peering
- Ensure `app.set('trust proxy', 1)` is enabled for rate limiter behind proxy

### MongoDB Atlas

- whitelist correct IP ranges or use sensor network rules
- avoid `0.0.0.0/0` in production
- use strong credentials and rotate if exposed

---

## 11. Interview Talking Points

### Architecture

- “The app separates frontend and backend with a REST API.”
- “Frontend is Vite + React; backend is Express + MongoDB.”
- “Authentication is JWT-based with access and refresh tokens.”
- “React Query handles caching and polling for live auction data.”
- “Backend uses middleware for security: helmet, CORS, rate limiting.”

### Strengths

- clean separation of concerns
- token refresh flow for user sessions
- bid and auction state stored in MongoDB
- React Query provides optimistic UI and cache invalidation

### Weaknesses / improvements

- current live updates are polling-based; better would be WebSocket-based real-time streaming
- image uploads are local file storage in `uploads/` which is not ideal for cloud deployment
- refresh token storage in `localStorage` is okay for this app but can be more secure with httpOnly cookies
- no explicit validation on some product routes beyond bid checks

### Security considerations

- password hashing with `bcryptjs`
- JWT secrets and expiration controls are required
- rate limiting protects /api routes
- CORS allows frontend access
- if deploying on Render, trust proxy is needed for real IP detection

### Orchestration

- Frontend uses Vite development server locally
- Backend uses nodemon in dev and `node server.js` in production
- Deployment orchestration is manual: set env vars, build frontend, deploy backend, configure CORS/URLs

---

## 12. Practical Preparation Questions

### What would you say the role of `VITE_API_BASE_URL` is?

- It configures the frontend API base URL for production, and it must be provided in Vercel or env files.

### How does the app refresh the auction price?

- React Query polls the backend every few seconds and updates the cached product state.

### Where are JWT tokens generated?

- In `backend/utils/token.js` using `jwt.sign()`.

### How are protected routes enforced?

- `backend/middleware/auth.js` checks the Authorization header and verifies the JWT.

### Why is `trust proxy` set in Express?

- Because Render sits behind a reverse proxy, so Express must trust `X-Forwarded-For` for correct client IP and rate limiting.

---

## 13. Example env values

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auction-house?retryWrites=true&w=majority
JWT_SECRET=supersecretaccesskey
JWT_REFRESH_SECRET=supersecretrefreshtoken
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 14. Quick summary of core files

- `backend/server.js` - app bootstrap, middleware, route mounting
- `backend/config/db.js` - MongoDB connection
- `backend/controllers/authController.js` - register/login/refresh/getMe
- `backend/controllers/productController.js` - products, bidding, auction lifecycle
- `backend/middleware/auth.js` - JWT validation
- `frontend/src/lib/api.ts` - axios wrapper + auth interceptors
- `frontend/src/pages/LiveAuction.tsx` - live bidding page and local cache updates
- `frontend/src/hooks/useProduct.ts` - fetch product and polling
- `frontend/src/hooks/useProductBids.ts` - bid history fetching
- `frontend/src/hooks/useProducts.ts` - home products fetching

---

## 15. Best way to present this in interview

1. Describe the architecture clearly.
2. Explain the user journey from browser to backend to database.
3. Mention JWT lifecycle, token storage, and refresh strategy.
4. Talk about current bid update mechanism and how it can be improved.
5. Point out deployment concerns: env vars, backend URL, proxy/trust settings.
6. Call out security practices and potential improvements.

---

## 16. Extra notes

- If asked how to improve live updates: mention Socket.IO / WebSockets / Pusher.
- If asked about deployment problems: mention Render IP whitelisting and `trust proxy`.
- If asked about auth security: mention `localStorage` vs `httpOnly cookie` tradeoffs.
- If asked about data consistency: mention bid validation and product updates in the backend.
