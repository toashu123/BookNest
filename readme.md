# 📚 BookNest - Book Review Platform

A full-stack MERN application where users can discover books, write reviews, and share their reading experiences with a vibrant community of book lovers.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based signup/login with bcrypt password hashing
- ✅ **Book Management** - Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Review System** - Rate books from 1-5 stars with detailed text reviews
- ✅ **Pagination** - Browse books efficiently with 5 books per page
- ✅ **Protected Routes** - Middleware authentication for secure endpoints
- ✅ **Dynamic Ratings** - Automatically calculated average ratings and review counts

### Bonus Features
- 🔍 **Search & Filter** - Search by title/author and filter by genre
- 📊 **Sorting Options** - Sort by title, author, year, or latest added
- 👤 **User Profiles** - Personal dashboard showing user's books and reviews
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS
- 🔒 **Authorization** - Users can only edit/delete their own content
- 📱 **Mobile Responsive** - Optimized for all screen sizes

## 🚀 Tech Stack

### Backend
- **Node.js** (v20+) - JavaScript runtime environment
- **Express.js** - Lightweight web framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - MongoDB object modeling (ODM)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and encryption

### Frontend
- **React 18** - UI component library
- **Vite** - Modern build tool and dev server
- **React Router v6** - Client-side routing
- **Context API** - Global state management
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Project Structure

book-review-platform/
├── backend/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── models/
│ │ ├── User.js # User schema
│ │ ├── Book.js # Book schema
│ │ └── Review.js # Review schema
│ ├── controllers/
│ │ ├── authController.js # Auth logic
│ │ ├── bookController.js # Book CRUD logic
│ │ └── reviewController.js # Review logic
│ ├── middleware/
│ │ └── auth.js # JWT verification
│ ├── routes/
│ │ ├── auth.js # Auth routes
│ │ ├── books.js # Book routes
│ │ └── reviews.js # Review routes
│ ├── seed/
│ │ └── importBooks.js # Import books from API
│ ├── .env # Environment variables
│ ├── server.js # Entry point
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── ProtectedRoute.jsx
│ │ │ ├── ThemeToggle.jsx
│ │ ├── context/
│ │ │ ├── AuthContext.jsx
│ │ │ └── ThemeContext.jsx
│ │ ├── pages/
│ │ │ ├── Signup.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── BookList.jsx
│ │ │ ├── BookDetails.jsx
│ │ │ ├── AddBook.jsx
│ │ │ ├── EditBook.jsx
│ │ │ └── Profile.jsx
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── vite.config.js
│ ├── tailwind.config.js
│ └── package.json
└── README.md

text

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the Repository
git clone https://github.com/toashu123/booknest.git
cd booknest

text

### 2. Backend Setup

cd backend
npm install

text

Create a `.env` file in the backend directory:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreviews?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development

text

**Generate JWT Secret:**
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

text

**Start Backend Server:**
npm start

or for development with auto-reload
npm run dev

text

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

cd ../frontend
npm install

text

**Start Frontend:**
npm run dev

text

Frontend will run on `http://localhost:3000`

### 4. Import Sample Books (Optional)

cd backend
npm install axios
node seed/importBooks.js

text

This will import 50+ books from Open Library API.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Books
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books?page=1&search=&genre=&sort=` | Get all books with filters | No |
| GET | `/api/books/:id` | Get book details with reviews | No |
| POST | `/api/books` | Create new book | Yes |
| PUT | `/api/books/:id` | Update book (owner only) | Yes |
| DELETE | `/api/books/:id` | Delete book (owner only) | Yes |

### Reviews
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Create review | Yes |
| PUT | `/api/reviews/:id` | Update review (owner only) | Yes |
| DELETE | `/api/reviews/:id` | Delete review (owner only) | Yes |
| GET | `/api/reviews/user/:userId` | Get user's reviews | No |

## 🗄️ Database Schema

### User Model
{
name: String (required, min: 2 chars),
email: String (required, unique, lowercase),
password: String (required, hashed, min: 6 chars),
timestamps: true
}

text

### Book Model
{
title: String (required, max: 200 chars),
author: String (required),
description: String (required, min: 10 chars),
genre: Enum (Fiction, Sci-Fi, Mystery, etc.),
publishedYear: Number (required, 1000-2026),
addedBy: ObjectId (ref: User),
timestamps: true
}

text

### Review Model
{
bookId: ObjectId (ref: Book),
userId: ObjectId (ref: User),
rating: Number (1-5, required),
reviewText: String (10-1000 chars),
timestamps: true
}

text

## 🧪 Testing with Postman

### 1. Register User
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}

text

### 2. Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "password123"
}

text

Copy the returned `token` for authenticated requests.

### 3. Add Book
POST http://localhost:5000/api/books
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"title": "The Great Gatsby",
"author": "F. Scott Fitzgerald",
"description": "A classic American novel set in the Jazz Age.",
"genre": "Fiction",
"publishedYear": 1925
}

text

### 4. Add Review
POST http://localhost:5000/api/reviews
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"bookId": "BOOK_ID_FROM_PREVIOUS_RESPONSE",
"rating": 5,
"reviewText": "An absolute masterpiece! Highly recommended."
}



## 📧 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

**Built with ❤️ using the MERN Stack**