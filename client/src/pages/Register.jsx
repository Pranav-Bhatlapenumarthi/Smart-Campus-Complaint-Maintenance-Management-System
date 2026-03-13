import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import './Auth.css'

const Register = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role
    })
  }

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const roles = [
    {
      value: 'student',
      label: 'Student',
      icon: '📚',
      description: 'Register and track complaints'
    },
    {
      value: 'faculty',
      label: 'Faculty',
      icon: '👨‍🏫',
      description: 'Staff member access'
    },
    {
      value: 'technician',
      label: 'Technician',
      icon: '🔧',
      description: 'Resolve complaints'
    }
  ]

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">🎓</div>
            </div>
            <h1>Smart Campus</h1>
            <p className="auth-subtitle">Complaint & Maintenance Management</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Create Account</h2>
            <p className="form-description">Join the campus complaint management system</p>

            {error && (
              <div className="error-message">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label>Select Your Role</label>
              <div className="role-selector">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className={`role-option ${formData.role === role.value ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(role.value)}
                  >
                    <div className="role-icon">{role.icon}</div>
                    <div className="role-title">{role.label}</div>
                    <div className="role-description">{role.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@campus.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <FiCheckCircle className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
