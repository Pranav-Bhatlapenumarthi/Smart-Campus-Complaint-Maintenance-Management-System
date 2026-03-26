import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiFilter, FiSearch, FiPlusCircle, FiRefreshCw } from 'react-icons/fi'
import './Dashboard.css'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    filterAndSearch()
  }, [complaints, searchTerm, filterStatus])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      console.log('Fetching complaints for faculty user:', user?.email)
      const response = await axios.get('/api/v1/complaints')
      const complaintsData = response.data.data || response.data
      console.log('Response structure:', response.data)
      console.log('Fetched faculty complaints:', complaintsData)
      setComplaints(Array.isArray(complaintsData) ? complaintsData : [])
      calculateStats(Array.isArray(complaintsData) ? complaintsData : [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching complaints:', error)
      console.error('Error response:', error.response)
      setComplaints([])
      setLoading(false)
    }
  }

  const calculateStats = (complaintsData) => {
    setStats({
      total: complaintsData.length,
      pending: complaintsData.filter(c => c.status === 'pending').length,
      inProgress: complaintsData.filter(c => c.status === 'in-progress').length,
      resolved: complaintsData.filter(c => c.status === 'resolved' || c.status === 'closed').length
    })
  }

  const filterAndSearch = () => {
    let filtered = complaints

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredComplaints(filtered)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">My Maintenance Requests</h1>
            <p className="dashboard-subtitle">Track and manage your facility maintenance requests</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-secondary"
              onClick={fetchComplaints}
              title="Refresh complaints list"
            >
              <FiRefreshCw /> Refresh
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/complaint/new')}
            >
              <FiPlusCircle /> New Request
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
          
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          
          <div className="stat-card stat-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          
          <div className="stat-card stat-resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="controls-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <FiFilter />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length > 0 ? (
          <div className="complaints-grid">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No maintenance requests yet</h3>
            <p>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Click "New Request" to submit your first maintenance request'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FacultyDashboard
