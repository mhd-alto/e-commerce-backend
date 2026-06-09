# Library Management API

A Node.js + Express + TypeScript API for managing a small library system with books, customers, orders, inventory, transactions, and borrow records.

## Overview

This project exposes REST endpoints for:

- Books
- Customers
- Inventory
- Orders
- Transactions
- Borrow records

It uses MongoDB via Mongoose and runs with Express on top of TypeScript.

## Features

- Create, list, retrieve, update, and delete books
- Manage customers and orders
- Track inventory availability and copies
- Record buy/borrow transactions
- Track borrow records and returns
- Health check endpoint for quick verification
- Postman collection included for quick testing

## Tech Stack

- TypeScript
- Express.js
- Mongoose
- MongoDB
- ts-node for development
- TypeScript compiler for production builds

## Project Structure

```text
.
├── app.ts               # Express app setup
├── server.ts            # Start server
├── package.json         # Scripts and dependencies
├── postman_collection.json
├── src/
│   ├── config/          # DB and environment config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Validation and error middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── validations/     # Request validation rules
│   └── utils/           # Utility helpers
└── dist/                # Build output
```

## Prerequisites

Before running the project, make sure you have:

- Node.js (recommended current LTS)
- npm
- MongoDB running locally or a reachable MongoDB URI

## Environment Variables

The app reads its settings from the environment via `src/config/env.ts`.

Default values:

- `PORT=3000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/my-express-app`
- `NODE_ENV=development`

You can create a `.env` file in the project root with values like:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/my-express-app
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

This starts the app using `ts-node` and watches for changes.

## Build for Production

```bash
npm run build
```

## Start the Built App

```bash
npm start
```

## API Base URL

By default the API is available at:

```text
http://localhost:3000/api
```

## Main Endpoints

### Health

```http
GET /health
```

### Books

```http
GET    /api/books
GET    /api/books/:id
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
```

### Customers

```http
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Orders

```http
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

### Inventory

```http
GET    /api/inventories
GET    /api/inventories/:bookId
POST   /api/inventories
```

### Transactions

```http
GET    /api/transactions
GET    /api/transactions/by-order/:orderId
POST   /api/transactions
POST   /api/transactions/complete-buy/:orderId
POST   /api/transactions/complete-borrow/:orderId
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Borrow Records

```http
GET    /api/borrow-records
GET    /api/borrow-records/book/:bookId
GET    /api/borrow-records/customer/:customerId
GET    /api/borrow-records/:id
POST   /api/borrow-records
POST   /api/borrow-records/:id/return
```

## Example Requests

### Create a book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "isbn": "978-0201616224",
    "publishedYear": 1999
  }'
```

### Create a customer

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1-555-0100"
  }'
```

### Check app health

```bash
curl http://localhost:3000/health
```

## Testing with Postman

A ready-to-import collection is available at:

```text
postman_collection.json
```

Import it into Postman and set the `baseUrl` variable to:

```text
http://localhost:3000
```

## Notes

- The API uses simple validation middleware for create/update request payloads.
- Inventory availability is checked when borrow operations are performed.
- Some endpoints are still evolving, so the Postman collection is the best quick reference for sample payloads.

## License

This project is for learning and development purposes.
