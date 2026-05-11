# VietQR REST API Documentation

## 1. Authentication
Hệ thống sử dụng đồng thời JWT cho Dashboard và API Key cho Merchant.
- **JWT**: Gửi qua Header `Authorization: Bearer <token>`
- **API Key**: Gửi qua Header `x-api-key: <your_api_key>`

## 2. API Endpoints

### 2.1 Generate QR Code (Dynamic/Static)
- **POST** `/api/v1/qr/generate`
- **Request Body:**
```json
{
  "bankBin": "970436",
  "accountNumber": "123456789",
  "accountName": "NGUYEN VAN A",
  "amount": 50000,
  "description": "Thanh toan hoa don",
  "externalRef": "ORDER-101"
}
```
- **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "qrPayload": "00020101021238540010A0000007270124000697043601101234567890208QRIBFTTA53037045405500005802VN62130809THANH TOAN6304E1F4",
    "qrImageUrl": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...",
    "transactionInfo": {
      "amount": 50000,
      "externalRef": "ORDER-101"
    }
  }
}
```

### 2.2 Payment Webhook (Callback)
API này được cấu hình để nhận thông báo từ ngân hàng hoặc các service scrap log.
- **POST** `/api/v1/webhooks/payment`
- **Payload Example:**
```json
{
  "transactionId": "BANK-12345",
  "amount": 50000,
  "content": "THANH TOAN HOA DON",
  "reference": "ORDER-101",
  "status": "SUCCESS"
}
```

## 3. Kiến trúc Kỹ thuật
- **Prisma ORM**: Quản lý Migrations và Database types.
- **Clean Architecture**: Tách biệt Domain logic và Infrastructure.
- **Docker**: Triển khai dễ dàng lên Kubernetes hoặc Cloud Run.
