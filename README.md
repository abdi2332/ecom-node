E-Commerce REST API
A comprehensive e-commerce backend API built with Node.js, Express, TypeScript, and PostgreSQL. Provides full-featured e-commerce functionality including user authentication, product management, order processing, and advanced search capabilities.

Features
User Authentication with JWT

Product Management (CRUD operations)

Order Processing with stock validation

Advanced Search and Filtering

Redis Caching for performance

Rate Limiting for security

API Documentation with Swagger

Image Uploads with Cloudinary

Comprehensive Unit Testing

Technology Choices
Node.js with TypeScript: Type safety and modern JavaScript features

Express.js: Lightweight and flexible web framework

PostgreSQL: Reliable relational database with ACID compliance

Prisma ORM: Type-safe database client with excellent TypeScript support

JWT: Stateless authentication for scalable applications

Redis: High-performance caching for frequently accessed data

Zod: Runtime type validation for robust API input handling

Jest: Comprehensive testing framework with mocking capabilities

Docker: Containerization for consistent development environments

Prerequisites
Node.js 18 or higher

PostgreSQL 15 or higher

Redis 7 or higher

Cloudinary account (for image uploads)

Environment Variables
Create a .env file in the root directory with the following variables:

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
NODE_ENV=development
PORT=4000
Local Development Setup
Clone the repository

bash
git clone <repository-url>
cd ecom-node
Install dependencies

bash
npm install
Set up the database

bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
Start the development server

bash
npm run dev
The API will be available at http://localhost:4000

Available Scripts
npm run dev - Start development server with hot reload

npm run build - Build the TypeScript project

npm start - Start production server

npm test - Run test suite

npm run test:watch - Run tests in watch mode

npm run test:coverage - Run tests with coverage report

npx prisma migrate dev - Create and apply database migrations

npx prisma generate - Generate Prisma client

API Documentation
Once the server is running, access the Swagger API documentation at:
http://localhost:4000/api-docs

Database Setup with Docker
The project includes a docker-compose.yml file for easy database setup:

bash
# Start PostgreSQL and Redis
docker-compose up -d

# Stop services
docker-compose down
This will start:

PostgreSQL on port 5432

Redis on port 6379



Database mocking with jest-mock-extended

API endpoint testing with Supertest

Authentication and authorization tests

Project Structure
text
src/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── routes/         # API routes
├── utils/          # Utilities and helpers
├── prisma/         # Database schema and migrations
└── tests/          # Test files
API Endpoints
Authentication
POST /auth/register - User registration

POST /auth/login - User login

Products
GET /products - List products with search and filters

GET /products/:id - Get product details

POST /products - Create product (Admin only)

PUT /products/:id - Update product (Admin only)

PATCH /products/:id/image - Upload product image (Admin only)

Orders
POST /orders - Place new order

GET /orders - Get user's order history

Rate Limiting
The API implements rate limiting for security:

General API: 1000 requests per 15 minutes

Authentication: 5 attempts per 15 minutes

Orders: 10 orders per hour

Search: 30 requests per minute

Caching
Redis is used for caching:

Product listings are cached for 5 minutes

Filter options are cached for 1 hour

Cache is automatically invalidated on data changes

Contributing
Follow conventional commit messages

Write tests for new features

Ensure all tests pass before submitting

Update documentation as needed



