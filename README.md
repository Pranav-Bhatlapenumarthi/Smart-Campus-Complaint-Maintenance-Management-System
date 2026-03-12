# Smart-Campus-Complaint-Maintenance-Management-System
# Smart Campus Complaint & Maintenance Management System - Frontend

A modern, responsive React frontend for the Smart Campus Complaint Management System.

## 🚀 Features

### For Students & Faculty
- ✅ Register and submit maintenance complaints
- 📊 Track complaint status in real-time
- 🔍 Search and filter complaints
- 📸 Upload images with complaints
- 🎯 Priority-based complaint submission
- 📈 Personal complaint dashboard

### For Technicians
- 🔧 View assigned complaints
- 📝 Update complaint status
- ✏️ Add work notes and updates
- 📊 Track workload statistics

### For Administrators
- 👥 Manage all complaints
- 🎯 Assign complaints to technicians
- 📊 System-wide analytics
- 🔍 Advanced filtering and search
- 📈 Monitor system performance

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with campus-friendly design
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Animations**: Smooth transitions and micro-interactions
- **Dark Mode Ready**: CSS variable-based theming
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **date-fns** - Date formatting
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── ComplaintCard.jsx
│   ├── PrivateRoute.jsx
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── StudentDashboard.jsx
│   ├── TechnicianDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── ComplaintForm.jsx
│   └── ComplaintDetail.jsx
├── context/            # React context
│   └── AuthContext.jsx
├── styles/             # Global styles
│   └── index.css
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   
   Create a `.env` file (optional - uses proxy by default):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 User Roles & Access

| Role | Dashboard | Create Complaints | Update Status | Assign Complaints |
|------|-----------|-------------------|---------------|-------------------|
| Student | ✅ | ✅ | ❌ | ❌ |
| Faculty | ✅ | ✅ | ❌ | ❌ |
| Technician | ✅ | ❌ | ✅ | ❌ |
| Admin | ✅ | ❌ | ✅ | ✅ |

## 🔐 Authentication

The app uses JWT-based authentication:
- Access tokens stored in localStorage
- Automatic token refresh
- Protected routes with role-based access
- Automatic redirect on auth failure

## 🎨 Styling & Theming

The app uses CSS custom properties for theming:

```css
:root {
  --primary: #1a5490;
  --secondary: #16a34a;
  --accent: #f59e0b;
  /* ... more variables */
}
```

To customize colors, edit `src/styles/index.css`.

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 641px - 1024px
- Desktop: > 1024px

## 🔧 API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Complaints
- `GET /api/complaints` - Get all complaints (admin)
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/assigned-to-me` - Get assigned complaints (technician)
- `GET /api/complaints/:id` - Get complaint details
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/:id/status` - Update status
- `PUT /api/complaints/:id/assign` - Assign technician

### Users
- `GET /api/users/technicians` - Get all technicians

## 🧪 Development Tips

### Hot Reload
Vite provides instant hot module replacement (HMR) during development.

### Debugging
Use React DevTools browser extension for component inspection.

### Code Style
Follow the existing code style:
- Functional components with hooks
- Named exports for components
- CSS modules or component-scoped CSS

## 📦 Dependencies

### Core
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0

### Utilities
- axios: ^1.6.2
- date-fns: ^2.30.0
- react-icons: ^4.12.0
- framer-motion: ^10.16.16

### Development
- vite: ^5.0.0
- @vitejs/plugin-react: ^4.2.0
- eslint: ^8.55.0

## 🐛 Troubleshooting

### Issue: API requests failing
**Solution**: Check that backend server is running on port 5000 and CORS is enabled.

### Issue: Authentication not persisting
**Solution**: Check browser localStorage and ensure tokens are being saved.

### Issue: Images not uploading
**Solution**: Verify backend accepts multipart/form-data and has proper file size limits.

### Issue: Build errors
**Solution**: Clear node_modules and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the Software Engineering course at VIT.

## 👥 Team

- Pranav Bhatlapenumarthi (23BCE2359)
- Shubham Kumar (23BCI0017)
- Nikhil Arya (23BAI0142)

## 🎓 Course Information

**Course**: Software Engineering  
**Project**: Smart Campus Complaint & Maintenance Management System  
**Institution**: VIT

---

**Note**: This frontend requires the corresponding backend server to be running. Make sure to start the backend before running the frontend application.
