# LuxeShop - Modern E-Commerce Frontend

A beautiful, fully-featured e-commerce frontend built with Vue 3, Vite, and Tailwind CSS.

## 🚀 Features

### Pages
- **Home Page**: Beautiful product grid with category filtering
- **Product Details**: Detailed product view with images, descriptions, and reviews
- **Shopping Cart**: Full cart management with quantity controls
- **Checkout**: Complete checkout flow with shipping and payment forms
- **Authentication**: Login and registration pages with social login UI

### Functionality
- ✅ Product browsing and filtering by category
- ✅ Add to cart functionality
- ✅ Cart management (add, remove, update quantities)
- ✅ Persistent cart (saved in localStorage)
- ✅ User authentication (login/register)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful UI with Tailwind CSS
- ✅ Smooth animations and transitions
- ✅ Product ratings and reviews display

### Design Features
- 🎨 Modern, clean interface
- 📱 Fully responsive layout
- 🌈 Beautiful gradient accents
- ✨ Smooth transitions and hover effects
- 🖼️ High-quality product images from Unsplash
- 🎯 Intuitive user experience

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Tailwind CSS** - Utility-first CSS framework
- **LocalStorage** - For cart and user persistence

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── assets/          # Styles and static assets
├── components/      # Reusable components
│   ├── Header.vue   # Main navigation header
│   └── Footer.vue   # Site footer
├── views/           # Page components
│   ├── Home.vue           # Product listing page
│   ├── ProductDetail.vue  # Individual product page
│   ├── Cart.vue           # Shopping cart
│   ├── Checkout.vue       # Checkout flow
│   ├── Login.vue          # User login
│   └── Register.vue       # User registration
├── router/          # Vue Router configuration
│   └── index.js
├── store/           # State management
│   └── index.js     # Reactive store with cart & products
├── App.vue          # Root component
└── main.js          # Application entry point
```

## 🎯 Key Components

### Store Management (`src/store/index.js`)
- Reactive state management using Vue 3's `reactive()`
- Cart operations (add, remove, update)
- User authentication
- LocalStorage persistence

### Router (`src/router/index.js`)
- Client-side routing with Vue Router
- Smooth page transitions
- Scroll behavior management

### Product Data
The application includes 8 sample products across two categories:
- Electronics (headphones, watches, earbuds, camera)
- Fashion (sunglasses, backpack, sneakers, watch)

## 🎨 Styling

### Tailwind Configuration
- Custom color palette with blue primary colors
- Responsive breakpoints
- Custom animations
- Optimized for production

### Features
- Hover effects on interactive elements
- Loading animations
- Smooth transitions
- Custom scrollbar styling

## 🔐 Authentication

The app includes a simulated authentication system:
- Login and registration forms
- User session management
- Protected checkout flow (demo mode)
- Social login UI (Google, Facebook)

**Note**: Authentication is simulated for demo purposes. In production, integrate with a real backend API.

## 🛒 Shopping Cart

- Add products from any page
- Update quantities
- Remove items
- Persistent across sessions
- Real-time total calculation
- Tax calculation (10%)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

The app can be deployed to any static hosting service:

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Push dist folder to gh-pages branch
```

## 📝 Future Enhancements

Potential features to add:
- [ ] Backend API integration
- [ ] Real payment processing
- [ ] User profile management
- [ ] Order history
- [ ] Product search functionality
- [ ] Wishlist feature
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Admin dashboard

## 👤 Author

Created for MDX University Semester 1 Project

## 📄 License

This project is for educational purposes.

---

**Note**: This is a frontend demo application. Product images are from Unsplash. No real transactions are processed.
