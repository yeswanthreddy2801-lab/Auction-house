# Auction House Backend

Production-ready backend for the Auction House marketplace.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (Access & Refresh Tokens)
- Multer (File Uploads)
- Express Validator
- Helmet, CORS, Rate Limiting

## Prerequisites
- Node.js installed
- MongoDB installed and running locally (or Atlas URI)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Rename `.env.example` to `.env`
   - Update `MONGODB_URI` and `JWT_SECRET`

4. Run the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Folder Structure
- `/config` - Database and third-party configs
- `/controllers` - Main logic for each route
- `/models` - Mongoose schemas
- `/routes` - API endpoint definitions
- `/middleware` - Authentication, error handling, and validation
- `/utils` - Helper functions
- `/uploads` - Locally stored images (temporary)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh-token` - Get new access token
- `GET /api/auth/me` - Get current user profile

### Seller
- `POST /api/seller/request` - Request to become a seller

### Products
- `GET /api/products/home` - Get approved & active products for homepage
- `GET /api/products` - List all products (supports filters/sorting/pagination)
- `POST /api/products` - Create a new auction item (Seller only)
- `POST /api/products/:id/bid` - Place a bid on an auction

### Admin
- `GET /api/admin/users` - View all users
- `PATCH /api/admin/approve-seller/:id` - Approve seller request
- `PATCH /api/admin/approve-product/:id` - Approve auction item
- `GET /api/admin/stats` - Platform statistics

## Security
- Password hashing with Bcrypt
- Route protection with JWT middleware
- RBAC (Buyer, Seller, Admin)
- Helmet security headers
- Rate limiting to prevent abuse
