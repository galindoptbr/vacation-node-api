# Vacation Management API

This is a RESTful API for employee vacation management, built with Node.js, Express, and MongoDB.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Jest (for testing)

## Prerequisites

- Node.js installed
- MongoDB installed and running
- NPM or Yarn

## Installation

1. Clone the repository:
```bash
git clone [REPOSITORY_URL]
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

## How to Run

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Tests
```bash
npm test
```

## API Documentation

### Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/users` | List all users (available for all authenticated users) | Yes |

#### Vacations (`/api/ferias`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/ferias/admin` | List all vacations (admin) | Yes |
| DELETE | `/api/ferias/admin/:id` | Delete any vacation request (admin) | Yes |

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the request header:

```
Authorization: Bearer your_jwt_token
```

## Application Flow

### 1. Initialization
- Application starts in `index.js`
- Express and basic middleware configuration (CORS, JSON)
- MongoDB database connection
- Main routes configuration

### 2. Authentication
1. **User Registration**
   - Client sends data to `/api/auth/register`
   - System validates data
   - Password is hashed with bcrypt
   - User is created in MongoDB

2. **Login**
   - Client sends credentials to `/api/auth/login`
   - System validates credentials
   - Generates JWT token
   - Returns token to client

3. **User Listing**
   - Any authenticated user can list all users
   - Sensitive data (like passwords) is excluded from results
   - No admin privileges required

### 3. Protected Requests
1. Client sends request with JWT token
2. Authentication middleware (`authMiddleware`) verifies token
3. If valid, allows route access
4. If invalid, returns 401 error

### 4. Vacation Management
1. **Admin Access**
   - `/api/ferias/admin` route requires authentication
   - Middleware verifies if user is admin
   - Returns complete vacation list
   - **New:** `/api/ferias/admin/:id` allows admin to delete any vacation request

2. **User Access**
   - Specific routes for common users
   - Access limited to own vacations
   - Permission validations

### 5. Error Handling
- Global middleware captures errors
- Errors are logged to console
- Standardized error responses
- Appropriate HTTP status codes

## Security

- All passwords are hashed using bcrypt
- JWT authentication
- Route protection with authentication middleware
- Access levels (common user and admin)
- Sensitive data exclusion in responses

## Project Structure

```
src/
├── controllers/     # Application controllers
├── middlewares/    # Application middlewares
├── models/         # MongoDB models
├── routes/         # Route definitions
└── index.js        # Main file
```

## Testing

The project uses Jest for testing. To run the tests:

```bash
npm test
```

## Best Practices

- Clear separation of concerns
- Middleware usage for authentication
- Centralized error handling
- Clear and organized documentation
- Automated testing
- Data privacy protection

## License

This project is licensed under the ISC License. 