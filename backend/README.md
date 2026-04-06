# Wesplit - Expense Sharing Backend

A production-ready backend for an expense-sharing application built with Node.js, Express.js, and MongoDB.

## Features

- User authentication with JWT tokens
- Password hashing with bcrypt
- Input validation with Joi
- Global error handling
- MVC architecture
- RESTful API design
- CORS support
- Environment-based configuration

## Tech Stack

- **Node.js** (Latest LTS)
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **dotenv** - Environment variables

## Project Structure

```
wesplit/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wesplit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```

   Update the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `JWT_EXPIRE`: Token expiration time (e.g., '7d', '24h')

4. **Start MongoDB**

   Make sure MongoDB is running on your system. For local installation:
   ```bash
   # On Windows
   net start MongoDB

   # Or using brew on macOS
   brew services start mongodb/brew/mongodb-community
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server binds to `0.0.0.0` and uses `process.env.PORT` (default `5000`).

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "data": {
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "..."
      }
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as register

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "..."
      }
    }
  }
  ```

#### Health Check
- **GET** `/`
- **Response:** `200 OK`

#### Detailed Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Server is healthy"
  }
  ```

## Testing with Postman

1. **Register a new user** using the `/api/auth/register` endpoint
2. **Copy the JWT token** from the response
3. **Set Authorization header** for protected routes:
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Test protected endpoints** like `/api/auth/me`

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication with expiration
- Input validation and sanitization
- CORS protection
- Request payload size limits
- Secure headers

## Future Enhancements

This foundation is designed to be scalable for future features like:
- Groups management
- Expense tracking
- Settlements calculation
- Email notifications
- Password reset functionality
- User profiles and avatars

## Contributing

1. Follow the existing code style and architecture
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation for new features
5. Test thoroughly before committing

## License

This project is licensed under the MIT License.
