# Circle Bookstore Frontend

A modern, responsive bookstore web application built with Vue.js, featuring a clean interface for browsing and purchasing books.

## 🚀 Live Demo
[Circle Bookstore](https://lively-kringle-246a6e.netlify.app/)

## ✨ Features

- 📚 Browse comprehensive book listings
- 🔍 Search books by title, author, or ISBN
- 🔄 Dynamic sorting (by title, price, or stock)
- 📖 Detailed book information pages
- 🛒 Smooth purchase process with confirmation
- 📱 Fully responsive design (mobile, tablet, and desktop)
- ⚡ Real-time stock updates

## 🛠️ Technologies

- Vue.js 3 with Composition API
- TypeScript for type safety
- Vue Router for navigation
- Axios for API communication
- CSS3 for styling and animations

## 🏗️ Project Structure

circle-frontend/
├── src/
│   ├── api/          # API configuration and calls
│   ├── assets/       # Static assets
│   ├── components/   # Reusable Vue components
│   ├── router/       # Route configurations
│   ├── types/        # TypeScript type definitions
│   ├── views/        # Page components
│   ├── App.vue       # Root component
│   └── main.ts       # Application entry point
├── public/           # Public static assets
└── package.json      # Project dependencies and scripts

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (provided by Circle)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DukeZhu95/circle-frontend.git
cd circle-frontend

2. Install dependencies:
```bash
npm install

3. Start the development server:
```bash
npm run dev

4. Build for production:
```bash
npm run build

#### 🎯 Key Features Walkthrough
Home Page

Grid layout displaying all available books
Search functionality for quick book finding
Sorting options for better organization
Responsive design adapting to all screen sizes

Book Details Page

Comprehensive book information
Purchase functionality with confirmation dialog
Real-time stock updates
Loading states and error handling

#### 🌟 Implementation Highlights

Type Safety: Comprehensive TypeScript implementation
Component Architecture: Modular and reusable components
Responsive Design: Mobile-first approach
Error Handling: Robust error management
User Experience: Loading states, animations, and feedback
Code Quality: Clean, documented, and maintainable code

#### 📱 Responsive Design
The application is fully responsive with breakpoints at:

Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px

#### 🔧 Future Improvements

Add user authentication
Implement shopping cart functionality
Add book ratings and reviews
Enhance search with filters
Add wishlist feature
Implement progressive web app (PWA) features