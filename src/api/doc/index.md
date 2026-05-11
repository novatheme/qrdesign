# VietQR Gateway API Documentation

## Authentication
Most merchant and admin endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <your_token>`

QR Generation requires an API Key in the `x-api-key` header.

## Endpoints

### Auth
- `POST /api/v1/auth/login`: Login with email and password.

### Banks
- `GET /api/v1/banks`: List all supported Vietnamese banks.

### QR Generation
- `POST /api/v1/qr/generate`: Generate a VietQR payload and image.

### Merchant
- `GET /api/v1/merchant/stats`: Get transaction statistics for the logged-in merchant.

### Admin
- `GET /api/v1/admin/stats`: Get global system statistics (Admin only).

### Public
- `GET /api/v1/public/transaction/:id`: Get transaction details by ID.

### Webhooks
- `POST /api/v1/webhooks/payment-simulate`: Simulate a payment success for a transaction.
