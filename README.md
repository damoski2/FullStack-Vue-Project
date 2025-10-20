# AfterSchool Hub - After-School Classes Marketplace

A beautiful, fully-featured after-school classes and activities marketplace frontend built with Vue 3, Vite, and Tailwind CSS. This application allows students and parents to browse, select, and enroll in various after-school programs.

## 🚀 Features

### Pages
- **Home Page**: Beautiful class grid with category filtering and hero section
- **Lesson Details**: Detailed class view with teacher info, schedule, and learning outcomes
- **Enrollment Cart**: Full cart management for selected classes
- **Checkout**: Complete enrollment flow with parent, student, and payment information
- **Authentication**: Login and registration pages for parents and students

### Functionality
- ✅ Class browsing and filtering by category (Music, Math, Science, Sports, Art, Technology, Language)
- ✅ Add to cart (enrollment) functionality
- ✅ Cart management (add, remove, update quantities)
- ✅ Persistent cart (saved in localStorage)
- ✅ User authentication (login/register)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful UI with Tailwind CSS
- ✅ Smooth animations and transitions
- ✅ Class ratings and reviews display
- ✅ Teacher profiles with credentials
- ✅ Age-appropriate class recommendations

### Design Features
- 🎨 Modern, clean interface with education-focused design
- 📱 Fully responsive layout
- 🌈 Beautiful indigo-purple gradient accents
- ✨ Smooth transitions and hover effects
- 🖼️ High-quality class images from Unsplash
- 🎯 Intuitive user experience for both parents and students
- 👨‍🏫 Teacher avatars and credentials display
- ⭐ Featured classes highlighting

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
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
│   ├── Home.vue           # Class listing page
│   ├── LessonDetail.vue   # Individual class page
│   ├── Cart.vue           # Enrollment cart
│   ├── Checkout.vue       # Enrollment checkout
│   ├── Login.vue          # User login
│   └── Register.vue       # User registration
├── router/          # Vue Router configuration
│   └── index.js
├── store/           # State management
│   └── index.js     # Reactive store with cart & lessons
├── App.vue          # Root component
└── main.js          # Application entry point
```

## 🎯 Key Components

### Store Management (`src/store/index.js`)
- Reactive state management using Vue 3's `reactive()`
- Cart operations for class enrollments (add, remove, update)
- User authentication with role support (parent/student)
- LocalStorage persistence
- 12 sample after-school classes with complete details

### Router (`src/router/index.js`)
- Client-side routing with Vue Router
- Smooth page transitions
- Scroll behavior management
- Lesson detail routes with dynamic IDs

### Class Data
The application includes 12 diverse after-school classes across 8 categories:
- **Music**: Piano, Guitar
- **Math & Science**: Advanced Math, Science Explorers Lab
- **Sports**: Soccer, Tennis
- **Art**: Creative Art & Drawing
- **Technology**: Coding & Game Development, Robotics
- **Language**: Spanish, Creative Writing
- **Dance**: Ballet & Contemporary

Each class includes:
- Title, description, and learning outcomes
- Teacher name, credentials, and avatar
- Price per hour/session
- Duration and schedule
- Age group recommendations
- Student enrollment count
- Ratings and reviews
- Featured status

## 🎨 Styling

### Tailwind Configuration
- Indigo and purple primary colors for education theme
- Responsive breakpoints
- Custom animations and transitions
- Optimized for production

### Features
- Hover effects on class cards and interactive elements
- Fade-in animations for dynamic content
- Smooth transitions throughout
- Category badges and featured indicators

## 🔐 Authentication

The app includes a simulated authentication system:
- Login and registration forms
- Parent/guardian and student roles
- User session management
- Protected checkout flow (demo mode)
- Social login UI (Google, Facebook)

**Note**: Authentication is simulated for demo purposes. In production, integrate with a real backend API.

## 🛒 Enrollment Cart

- Add classes from any page
- Update enrollment quantities (for multiple students/sessions)
- Remove items
- Persistent across sessions (localStorage)
- Real-time total calculation
- Tax calculation (10%)
- Clear distinction between cart items with class details

## 📋 Checkout Process

The enrollment checkout includes comprehensive forms:
1. **Parent/Guardian Information**: Name, email, phone
2. **Student Information**: Name, age, grade level, special requirements
3. **Address Information**: Full address details
4. **Payment Information**: Card details (demo only)
5. **Enrollment Summary**: Review all selected classes before completing

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px (Single column, stacked layout)
- Tablet: 640px - 1024px (2 column grid)
- Desktop: > 1024px (3-4 column grid)

## 🎓 Educational Focus

### For Parents
- Clear class descriptions and learning outcomes
- Teacher credentials and experience
- Age-appropriate recommendations
- Transparent pricing structure
- Easy enrollment process
- Safety and security information

### For Students
- Engaging class descriptions
- Visual learning materials
- Variety of subjects and activities
- Skill development opportunities
- Small class sizes

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
- [ ] Real payment processing (Stripe, PayPal)
- [ ] Teacher profiles and management portal
- [ ] Class schedule calendar with availability
- [ ] Video conferencing for virtual classes
- [ ] Student progress tracking
- [ ] Review and rating system
- [ ] Email notifications for enrollments
- [ ] Parent-teacher messaging
- [ ] Attendance tracking
- [ ] Certificate generation
- [ ] Multi-language support
- [ ] Mobile app version

## 🎯 Target Audience

- **Primary**: Parents and guardians seeking quality after-school programs
- **Secondary**: Students (older ages) browsing and selecting classes
- **Age Range**: Programs for students aged 5-17 years

## 👤 Author

Created for MDX University Semester 1 Project - Front-End Development

## 📄 License

This project is for educational purposes.

---

**Note**: This is a frontend demo application for a fictitious after-school classes marketplace. Class images are from Unsplash, and teacher avatars are from Pravatar. No real transactions or enrollments are processed. All data is for demonstration purposes only.

## 📖 Additional Documentation

For a complete feature overview, see [FEATURES.md](./FEATURES.md)
