# Smart Campus Frontend - Quick Setup Guide

This guide will help you set up and run the frontend application in minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** installed (version 16 or higher)
  - Check: `node --version`
  - Download from: https://nodejs.org/

- ✅ **npm** (comes with Node.js)
  - Check: `npm --version`

- ✅ **Backend server** ready to run
  - Should be available on `http://localhost:5000`

## 🚀 Quick Start (5 Steps)

### Step 1: Navigate to Project Directory

```bash
cd campus-complaint-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes on first run).

### Step 3: Start the Backend Server

In a **separate terminal**, start your backend server:

```bash
cd ../backend  # or wherever your backend is
npm start
```

Make sure it's running on `http://localhost:5000`

### Step 4: Start the Frontend Development Server

Back in the frontend directory:

```bash
npm run dev
```

### Step 5: Open in Browser

The app will automatically open at:
```
http://localhost:3000
```

If it doesn't open automatically, click the link in the terminal.

## 🎉 You're Ready!

You should now see the login page. You can:

1. **Register** a new account
2. **Login** with your credentials
3. **Explore** the dashboard based on your role

## 🔧 Configuration (Optional)

### Changing the API URL

If your backend runs on a different port:

1. Create a `.env` file in the frontend root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:YOUR_PORT
   ```

3. Restart the dev server

### Changing the Frontend Port

To run on a different port (e.g., 3001):

Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001,  // Change this
  }
})
```

## 📱 Testing Different User Roles

To test the system properly, create accounts for each role:

### 1. Student Account
- Role: Student
- Can: Submit complaints, track status
- Dashboard: Shows personal complaints

### 2. Technician Account
- Role: Technician  
- Can: View assigned complaints, update status
- Dashboard: Shows assigned work

### 3. Admin Account
- Role: Admin
- Can: View all complaints, assign to technicians
- Dashboard: System-wide overview

## 🎯 Common Tasks

### Creating a New Complaint (Student/Faculty)

1. Login as Student or Faculty
2. Click "New Complaint" button
3. Fill in the form:
   - Title
   - Category
   - Location
   - Priority
   - Description
   - Images (optional)
4. Submit

### Assigning a Complaint (Admin)

1. Login as Admin
2. Click on any complaint card
3. In the sidebar, select a technician
4. Click "Assign"

### Updating Status (Technician/Admin)

1. Click on a complaint
2. In the sidebar, select new status
3. Add a note (optional)
4. Click "Update Status"

## 🐛 Troubleshooting

### Problem: "Cannot connect to backend"

**Solutions:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify CORS is enabled in backend
3. Check firewall settings

### Problem: "npm install" fails

**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again

### Problem: Login not working

**Solutions:**
1. Check backend MongoDB connection
2. Clear browser localStorage
3. Try a different browser
4. Check browser console for errors (F12)

### Problem: Images not uploading

**Solutions:**
1. Check backend file upload limits
2. Verify file size < 5MB
3. Use supported formats: JPG, PNG

### Problem: Port already in use

**Solution:**
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Project Structure Quick Reference

```
src/
├── components/       # Reusable UI components
├── pages/           # Main page components
├── context/         # React Context (Auth)
├── styles/          # Global CSS
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

### Key Files to Know

- **`src/context/AuthContext.jsx`** - Authentication logic
- **`src/App.jsx`** - Routing configuration
- **`src/styles/index.css`** - Global styles and theme
- **`vite.config.js`** - Build configuration
- **`package.json`** - Dependencies

## 🎨 Customizing the UI

### Change Colors

Edit `src/styles/index.css`:

```css
:root {
  --primary: #1a5490;      /* Main blue */
  --secondary: #16a34a;    /* Green */
  --accent: #f59e0b;       /* Orange */
  /* Change these to your preferred colors */
}
```

### Change Fonts

Edit `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT" rel="stylesheet">
```

Then update CSS:
```css
:root {
  --font-body: 'YOUR_FONT', sans-serif;
}
```

## 📊 Build for Production

When ready to deploy:

```bash
npm run build
```

This creates optimized files in `dist/` folder.

Preview production build:
```bash
npm run preview
```

## 🔒 Security Notes

- Never commit `.env` files with sensitive data
- Use environment variables for API URLs
- Keep dependencies updated: `npm audit`
- Use HTTPS in production

## ✅ Development Checklist

Before making changes:

- [ ] Backend is running
- [ ] Dependencies are installed
- [ ] Development server is running
- [ ] Browser DevTools open (F12)
- [ ] Terminal visible for logs

## 📞 Getting Help

If you're stuck:

1. Check browser console (F12) for errors
2. Check terminal for server errors
3. Review the README.md
4. Check network tab for failed API requests

## 🎓 Next Steps

1. ✅ Get the app running
2. ✅ Create test accounts for each role
3. ✅ Test the complete complaint lifecycle
4. ✅ Familiarize yourself with the code structure
5. ✅ Start developing Increment 2 features

## 💡 Pro Tips

- Use **React DevTools** browser extension for debugging
- Install **ESLint** extension in your code editor
- Use **Console.log()** for debugging
- Test on different screen sizes (responsive view)
- Keep terminal and browser side-by-side

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

**🎉 Happy Coding!**

If everything is working, you should see a beautiful login page with a gradient background and smooth animations. Register an account and start exploring!
