# Karni Exim Project Structure Documentation

This document outlines the structure and organization of the Karni Exim e-commerce website project after the redesign.

## Directory Structure

```
karni-exim/
├── public/                # Static assets served directly by the web server
│   ├── favicon.svg        # Site favicon
│   ├── logo.svg           # Company logo for public access
│   ├── _redirects         # Netlify redirects configuration
│   └── ...
├── src/                   # Source code
│   ├── assets/            # Internal assets
│   │   ├── logo.svg       # Company logo
│   │   └── ...
│   ├── components/        # Reusable UI components
│   │   ├── Footer.jsx     # Site footer component
│   │   ├── Navbar.jsx     # Navigation bar component
│   │   ├── ProductCard.jsx # Product display card component
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   └── useProducts.js # Hook for product data operations
│   ├── pages/             # Application page components
│   │   ├── Home.jsx       # Home page
│   │   ├── Products.jsx   # Products listing page
│   │   ├── ProductDetails.jsx # Product details page
│   │   └── ...
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   ├── theme.css          # Theme variables
│   ├── design-system.css  # Design system documentation
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── redesign-summary.md    # Summary of redesign changes
├── redesign-completion-report.md # Detailed report of redesign project
└── README.md              # Project documentation
```

## Key Files

### Configuration Files

- **tailwind.config.js**: Contains custom color definitions and theme configurations for the Tailwind CSS framework
- **vite.config.js**: Vite build tool configuration

### Core Styling Files

- **theme.css**: Defines CSS variables for colors and other design tokens
- **design-system.css**: Documents and provides examples of the design system components
- **index.css**: Global styles and Tailwind imports

### Main Components

- **Navbar.jsx**: Site navigation with logo and responsive menu
- **Footer.jsx**: Site footer with company information and navigation
- **ProductCard.jsx**: Standard card component used for displaying products
- **HeroSection.jsx**: Banner section on the home page

### Key Pages

- **Home.jsx**: Landing page with hero section, featured products, and company overview
- **Products.jsx**: Product catalog with filtering options
- **ProductDetails.jsx**: Individual product view with details and inquiry options
- **About.jsx**: Company information page
- **Contact.jsx**: Contact information and form

## Color System

The redesigned site uses the following color palette:

- **Saffron** (#EBB924): Primary accent color for CTAs and highlights
- **Charcoal** (#344C5D, #3A5161): Primary dark colors for text and backgrounds
- **Beige** (#FEFBE3): Light background color
- **Cornsilk** (#FFFCE4): Secondary light background color
- **Battleship Gray** (#798789): Neutral text color

## Documentation Files

- **README.md**: General project overview
- **redesign-summary.md**: Task list and summary of redesign changes
- **redesign-completion-report.md**: Comprehensive report on the redesign project

## Build and Deployment

- **npm run dev**: Start development server
- **npm run build**: Create production build
- **npm run preview**: Preview the production build
- **npm run deploy**: Run linting, build the project, and start a preview server
