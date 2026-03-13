import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiFileText, FiUser, FiLogOut, FiPlusCircle } from 'react-icons/fi'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      student: '📚 Student',
      faculty: '👨‍🏫 Faculty',
      technician: '🔧 Technician',
      admin: '👑 Admin'
    }
    return roleMap[role] || role
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Smart Campus</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            <FiHome /> Dashboard
          </Link>
          
          {(user?.role === 'student' || user?.role === 'faculty') && (
            <Link to="/complaint/new" className="nav-link nav-link-highlight">
              <FiPlusCircle /> New Complaint
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-role">{getRoleDisplay(user?.role)}</span>
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
