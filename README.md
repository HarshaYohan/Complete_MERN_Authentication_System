# MERN Authentication System

A complete authentication system built with the MERN (MongoDB, Express.js, React, Node.js) stack. This system includes user registration, login, email verification via OTP, and password reset via email and OTP.

## Features

- User Signup with Email Verification (OTP-based)
- User Login with JWT Authentication
- Email Verification via OTP
- Password Reset using OTP and Email
- Secure Token-based Authentication
- MongoDB for storing user credentials
- Express.js as the backend framework
- React.js for the frontend
- Node.js for handling server-side logic

## Tech Stack

- **Frontend:** React.js, Axios, Tailwind CSS (optional)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens), bcrypt.js
- **Email Service:** Nodemailer

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (latest stable version)
- MongoDB (installed locally or using a cloud service like MongoDB Atlas)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mern-auth-system.git
cd Complete_MERN_Authentication
```

#### 2. Install Dependencies

##### Server
```bash
cd server
npm install
```

##### Client
```bash
cd ../client
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the backend directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### 4. Start the Development Servers

##### Server
```bash
cd server
npm run server
```

##### Client
```bash
cd client
npm run dev
```

## API Endpoints

### Authentication Routes

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login with email and password
- **POST** `/api/auth/logout` - Logout from the system
- **POST** `/api/auth/send-verify-otp` - Request email verify OTP
- **POST** `/api/auth/verify-account` - Verify email via OTP
- **POST** `/api/auth/is-auth` - check wether the user is authenticated
- **POST** `/api/auth/send-reset-otp` - Request password reset OTP
- **POST** `/api/auth/reset-password` - Reset password using OTP
- **POST** `/api/user/data` - get user data

## Folder Structure

```
mern-auth-system/
│── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│
│── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   ├── index.js
```

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.



