# SkillBooster App

A modern web application connecting skilled workers with customers who need services. Built with React, Vite, and Firebase.

## 🚀 Features

### For Workers
- **Dashboard**: Overview of today's jobs, recent activity, and quick stats
- **Job Management**: Create, edit, and track jobs with real-time status updates
- **Service Management**: Create and manage service offerings with categories and pricing
- **Dynamic Updates**: Jobs are dynamically fetched from Firestore and sorted by creation date
- **Mobile-Friendly**: Responsive design that works on all devices

### For Customers
- **Modern Home Page**: Clean, inclusive design with service carousel
- **Service Discovery**: Browse available services from skilled workers
- **Easy Navigation**: Intuitive user interface

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Routing**: React Router
- **State Management**: React Hooks
- **Icons**: Heroicons (SVG)

## 📱 Pages & Components

### Pages
- **Home**: Landing page with service carousel and testimonials
- **Worker Dashboard**: Central hub for workers with recent jobs and stats
- **Jobs**: Complete job management with filtering and modal details
- **Services**: Service creation and management for workers

### Key Components
- **ServiceCard**: Reusable component for displaying service information
- **JobCard**: Display job details with status indicators
- **JobDetailsModal**: Full job information in modal format
- **WorkerNavigation**: Navigation tabs for worker interface
- **JobFilters**: Advanced filtering and sorting for jobs

## 🎨 Design Features

- **Modern UI**: Clean, professional design with proper spacing
- **Responsive Layout**: Mobile-first design that scales to desktop
- **Consistent Styling**: Unified color scheme and component patterns
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper labels, semantic HTML, and keyboard navigation

## 🔥 Recent Updates

- ✅ Redesigned home page with carousel and inclusive copy
- ✅ Dynamic worker dashboard with real-time job data
- ✅ Clickable recent jobs with detailed modal view
- ✅ Complete services management flow with CRUD operations
- ✅ Extracted reusable ServiceCard component
- ✅ Enhanced job filtering and sorting capabilities
- ✅ Mobile-responsive design throughout

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alessandro-git-hub/skillBooster-app.git
   cd skillBooster-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Add your Firebase config to `src/utils/firebase.js`
   - Enable Firestore database

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ServiceCard.jsx     # Reusable service display component
│   ├── JobCard.jsx         # Job information display
│   ├── JobDetailsModal.jsx # Job details modal
│   ├── JobFilters.jsx     # Job filtering controls
│   └── WorkerNavigation.jsx # Worker interface navigation
├── pages/              # Main application pages
│   ├── Home.jsx           # Landing page
│   ├── WorkerDashboard.jsx # Worker dashboard
│   ├── Jobs.jsx           # Job management
│   └── Services.jsx       # Service management
├── utils/              # Utility functions
│   └── firebase.js        # Firebase configuration
└── App.jsx             # Main application component
```

## 🎯 Future Enhancements

- [ ] Customer booking flow
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Review and rating system
- [ ] Advanced search and filtering
- [ ] Worker profiles and portfolios
- [ ] Mobile app development
- [ ] Multi-language support

## 👨‍💻 Development

This project uses modern React patterns including:
- Functional components with hooks
- Custom hooks for shared logic
- Context for global state when needed
- Proper error handling and loading states
- Optimized re-renders with useMemo and useCallback

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by Alessandro
