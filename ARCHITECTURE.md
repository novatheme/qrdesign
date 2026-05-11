# VietQR Payment Gateway Architecture

## 1. System Overview
Hệ thống được thiết kế theo mô hình **Clean Architecture** (với NestJS coding pattern) để đảm bảo tính mở rộng và bảo mật.

### Core Components:
- **API Gateway/Server**: Xử lý Auth, QR Generation, Webhooks.
- **Worker Service**: Xử lý hàng đợi Webhook retry (Redis/BullMQ).
- **Socket Server**: Cung cấp cập nhật trạng thái thanh toán realtime.
- **Reporting Engine**: Tổng hợp dữ liệu cho Dashboard.

## 2. Database Schema (Prisma)
```prisma
model Merchant {
  id           String   @id @default(uuid())
  businessName String
  email        String   @unique
  apiKey       String   @unique
  secretKey    String
  webhookUrl   String?
  status       String   @default("ACTIVE") // ACTIVE, DISABLED
  transactions Transaction[]
}

model Transaction {
  id            String   @id @default(uuid())
  merchantId    String
  amount        Float
  bankBin       String
  accountNumber String
  description   String
  status        String   @default("PENDING") // PENDING, PAID, FAILED, EXPIRED
  qrPayload     String
  externalRef   String?
  createdAt     DateTime @default(now())
  paidAt        DateTime?
}
```

## 3. Technology Choices
- **Frontend**: Next.js 15 (App Router), shadcn/ui, Tailwind.
- **Backend**: NestJS (Node.js), Prisma.
- **Realtime**: Socket.IO.
- **Cache**: Redis.
- **Security**: JWT, Rate Limiting, Request Signing.
