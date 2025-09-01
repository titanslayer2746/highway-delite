# Highway Delite Backend API Specification

## Overview

This document provides detailed specifications for all API endpoints in the Highway Delite backend application.

## API Endpoints

### Authentication Routes

All authentication routes are prefixed with `/api/auth`

1. **POST** `/api/auth/register` - Register a new user
2. **POST** `/api/auth/verify-otp` - Verify email with OTP
3. **POST** `/api/auth/resend-otp` - Resend OTP for email verification
4. **POST** `/api/auth/login` - Login user
5. **POST** `/api/auth/logout` - Logout user
6. **GET** `/api/auth/dashboard` - Get user dashboard (Protected)

---

## API Specifications

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user and sends an OTP to their email for verification.

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "dob": "string (required, ISO date format)"
}
```

**Success Response (201):**

```json
{
  "message": "User registered. Please verify OTP sent to email."
}
```

**Error Responses:**

- `400 Bad Request`: User already exists

```json
{
  "message": "User already exists"
}
```

- `500 Internal Server Error`: Server error

```json
{
  "message": "Error registering user",
  "error": "error_details"
}
```

---

### 2. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Description:** Verifies the user's email using the OTP sent during registration.

**Request Body:**

```json
{
  "email": "string (required)",
  "otp": "string (required)"
}
```

**Success Response (200):**

```json
{
  "message": "Email verified successfully. You can now log in."
}
```

**Error Responses:**

- `400 Bad Request`: User not found

```json
{
  "message": "User not found"
}
```

- `400 Bad Request`: User already verified

```json
{
  "message": "User already verified"
}
```

- `400 Bad Request`: Invalid or expired OTP

```json
{
  "message": "Invalid or expired OTP"
}
```

- `500 Internal Server Error`: Server error

```json
{
  "message": "Error verifying OTP",
  "error": "error_details"
}
```

---

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`

**Description:** Resends a new OTP to the user's email for verification.

**Request Body:**

```json
{
  "email": "string (required)"
}
```

**Success Response (200):**

```json
{
  "message": "OTP resent successfully."
}
```

**Error Responses:**

- `400 Bad Request`: User not found

```json
{
  "message": "User not found"
}
```

- `400 Bad Request`: User already verified

```json
{
  "message": "User already verified"
}
```

- `500 Internal Server Error`: Server error

```json
{
  "message": "Error resending OTP",
  "error": "error_details"
}
```

---

### 4. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and creates a session.

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful"
}
```

**Error Responses:**

- `400 Bad Request`: User not found

```json
{
  "message": "User not found"
}
```

- `400 Bad Request`: Incorrect password

```json
{
  "message": "Incorrect password"
}
```

- `400 Bad Request`: Email not verified

```json
{
  "message": "Email not verified. Please verify OTP."
}
```

- `500 Internal Server Error`: Server error

```json
{
  "message": "Error logging in",
  "error": "error_details"
}
```

---

### 5. Logout User

**Endpoint:** `POST /api/auth/logout`

**Description:** Destroys the user's session and logs them out.

**Request Body:** None

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Response (500):**

```json
{
  "message": "Error logging out"
}
```

---

### 6. Get Dashboard

**Endpoint:** `GET /api/auth/dashboard`

**Description:** Returns dashboard data for authenticated users.

**Authentication:** Required (Session-based)

**Request Body:** None

**Success Response (200):**

```json
{
  "message": "Welcome to the dashboard, [user_name]"
}
```

**Error Response (401):** Unauthorized (if not authenticated)

---

## Data Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  dob: Date (required), // Date of birth
  otp: String, // For email verification
  otpExpiry: Date, // OTP expiration time
  isVerified: Boolean (default: false) // Email verification status
}
```

## Authentication Flow

1. **Registration:** User registers with name, email, password, and date of birth
2. **OTP Verification:** User receives OTP via email and verifies it
3. **Login:** User can login after email verification
4. **Session Management:** Uses Express sessions for authentication
5. **Protected Routes:** Dashboard requires valid session

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

Error responses include a `message` field and may include additional `error` details for debugging.

## Notes

- OTP expires after 10 minutes
- Passwords are stored in plain text (consider implementing hashing for production)
- Email verification is required before login
- Session-based authentication is used
- All requests expect JSON content type
