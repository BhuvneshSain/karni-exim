# 🧵 Karni Exim - Premium Textile Products Platform

> **Updated June 2025**: Complete redesign with new color palette and brand identity. [See redesign report](./redesign-completion-report.md) for details.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=for-the-badge&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

A modern, high-performance e-commerce platform for Karni Exim, a premier textile products company. This application showcases product catalogs, customer testimonials, and company information with an elegant, responsive UI built using React 19 and Vite.

![Karni Exim Homepage](public/screenshot-home.png)

## ✨ Features

### 🛍️ Product Management
- Dynamic product catalog with detailed information and high-quality images
- Bestseller showcase with animated carousel
- Product categorization and filtering
- Responsive product details pages with zooming capabilities

### 👥 Customer Reviews System
- Dynamic reviews ticker with elegant animations
- Firebase-backed review management system
- Admin-approved reviews workflow with safety flags
- Streamlined, minimal codebase with zero redundancy
- Responsive design for mobile and desktop

### 🔧 Admin Dashboard
- Secure authentication for administrators
- Complete content management for products, reviews, and website content
- Real-time updates using Firebase Firestore
- Image optimization and management

### 🎨 UI/UX Excellence
- Framer Motion animations for engaging user experience
- Responsive design that works on all devices
- Performance optimized loading states
- Accessibility compliant components

### 🧰 Developer Experience
- Hot module replacement for fast development
- Comprehensive error handling and debugging tools
- Maintenance utilities for database management
- Clean project architecture

## 🚀 Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase account

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/karni-exim.git
   cd karni-exim
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with Firebase configuration
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Build for production
   ```bash
   npm run build
   ```

## 💻 Admin Panel

The admin panel is accessible at `/karni-admin` and provides a comprehensive dashboard for managing:

- **Products**: Add, edit, and remove products from the catalog
- **Reviews**: Approve customer reviews and testimonials
- **Statistics**: Update company metrics displayed on the homepage
- **Hero Content**: Customize the hero section images and messaging
- **Media Library**: Upload and manage images for products and content

### Admin Scripts

Maintenance utilities are available in the `admin` directory:

```bash
# Fix review flags and ensure proper configuration
npm run fix-reviews

# Diagnose review timestamp issues
npm run diagnose-reviews

# Verify current state of reviews in the database
npm run verify-reviews
```

## 🏗️ Project Structure

```
karni-exim/
├── admin/               # Admin maintenance utilities
├── public/              # Static assets
├── src/
│   ├── assets/          # Application assets
│   ├── components/      # Reusable UI components
│   ├── debug/           # Development debugging tools
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages/routes
│   └── utils/           # Utility functions
├── .env                 # Environment variables
└── package.json         # Project dependencies
```

## 🛠️ Technologies Used

### Frontend
- **React 19**: Latest React with hooks for state management
- **Framer Motion**: Advanced animations and transitions
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Icons**: Icon library for UI elements

### Backend & Infrastructure
- **Firebase Authentication**: Secure user authentication
- **Firebase Firestore**: NoSQL database for products and reviews
- **Firebase Storage**: Media storage for product images
- **Vite**: Next-generation frontend build tool

### Developer Tools
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Firebase SDK**: Firebase JavaScript SDK

## 📱 Responsive Design

The application is fully responsive across all devices:
- Mobile-first approach
- Tailored layouts for tablets and desktops
- Touch-friendly interface elements
- Optimized images for different screen sizes

## 📈 Performance Optimizations

- Lazy loading of images and components
- Code splitting for faster initial load times
- Optimized Firebase queries
- Image size optimization
- Resource prefetching for common user journeys

## 🔒 Security Features

- Secure Firebase Rules for database protection
- Authentication with role-based access control
- Environment variable protection
- Input validation and sanitization

## 📝 License

[MIT License](LICENSE)

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
