import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiFilter, FiSearch } from 'react-icons/fi'
import './Dashboard.css'

const TechnicianDashboard = () => {
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
    fetchAssignedComplaints()
  }, [])

  useEffect(() => {
    filterAndSearch()
  }, [complaints, searchTerm, filterStatus])

  const fetchAssignedComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints/assigned-to-me')
      setComplaints(response.data.complaints)
      calculateStats(response.data.complaints)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching assigned complaints:', error)
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

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }

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
            <h1 className="dashboard-title">Assigned Complaints</h1>
            <p className="dashboard-subtitle">Manage and resolve maintenance requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Assigned to Me</div>
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
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          
          <div className="stat-card stat-resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="controls-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search complaints..."
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
            <div className="empty-state-icon">🔧</div>
            <h3>No complaints assigned</h3>
            <p>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'You currently have no complaints assigned to you'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TechnicianDashboard
