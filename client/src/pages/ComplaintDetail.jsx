import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  FiClock, FiMapPin, FiAlertCircle, FiUser, 
  FiCheckCircle, FiArrowLeft, FiMessageSquare 
} from 'react-icons/fi'
import { formatDistanceToNow, format } from 'date-fns'
import './ComplaintDetail.css'

const ComplaintDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [assignTechnicianId, setAssignTechnicianId] = useState('')
  const [technicians, setTechnicians] = useState([])
  const [updateNote, setUpdateNote] = useState('')

  useEffect(() => {
    fetchComplaintDetails()
    if (user?.role === 'admin') {
      fetchTechnicians()
    }
  }, [id])

  const fetchComplaintDetails = async () => {
    try {
      const response = await axios.get(`/api/complaints/${id}`)
      setComplaint(response.data.complaint)
      setNewStatus(response.data.complaint.status)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching complaint:', error)
      setLoading(false)
    }
  }

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get('/api/users/technicians')
      setTechnicians(response.data.technicians)
    } catch (error) {
      console.error('Error fetching technicians:', error)
    }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus) return

    setUpdating(true)
    try {
      const response = await axios.put(`/api/complaints/${id}/status`, {
        status: newStatus,
        note: updateNote
      })
      setComplaint(response.data.complaint)
      setUpdateNote('')
      alert('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
    setUpdating(false)
  }

  const handleAssignTechnician = async () => {
    if (!assignTechnicianId) return

    setUpdating(true)
    try {
      const response = await axios.put(`/api/complaints/${id}/assign`, {
        technicianId: assignTechnicianId
      })
      setComplaint(response.data.complaint)
      alert('Technician assigned successfully')
    } catch (error) {
      console.error('Error assigning technician:', error)
      alert('Failed to assign technician')
    }
    setUpdating(false)
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      low: { icon: '🟢', label: 'Low Priority', class: 'priority-low' },
      medium: { icon: '🟡', label: 'Medium Priority', class: 'priority-medium' },
      high: { icon: '🔴', label: 'High Priority', class: 'priority-high' }
    }
    return badges[priority] || badges.medium
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', class: 'badge-pending' },
      'in-progress': { label: 'In Progress', class: 'badge-progress' },
      resolved: { label: 'Resolved', class: 'badge-resolved' },
      closed: { label: 'Closed', class: 'badge-closed' },
      rejected: { label: 'Rejected', class: 'badge-rejected' }
    }
    return statusMap[status] || statusMap.pending
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!complaint) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="detail-container">
          <div className="error-state">
            <h2>Complaint not found</h2>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const priority = getPriorityBadge(complaint.priority)
  const status = getStatusBadge(complaint.status)
  const canUpdateStatus = user?.role === 'technician' || user?.role === 'admin'
  const canAssign = user?.role === 'admin'

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <div className="detail-container">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="detail-card fade-in">
          <div className="detail-header">
            <div className="header-left">
              <div className="complaint-number">
                Complaint #{complaint.complaintId || complaint._id.slice(-6)}
              </div>
              <h1>{complaint.title}</h1>
              <div className="header-badges">
                <span className={`badge ${status.class}`}>{status.label}</span>
                <span className={`badge ${priority.class}`}>
                  {priority.icon} {priority.label}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-grid">
            {/* Main Content */}
            <div className="detail-main">
              <div className="info-section">
                <h3>Description</h3>
                <p>{complaint.description}</p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <FiAlertCircle />
                  <div>
                    <div className="info-label">Category</div>
                    <div className="info-value">{complaint.category}</div>
                  </div>
                </div>

                <div className="info-item">
                  <FiMapPin />
                  <div>
                    <div className="info-label">Location</div>
                    <div className="info-value">{complaint.location}</div>
                  </div>
                </div>

                <div className="info-item">
                  <FiUser />
                  <div>
                    <div className="info-label">Submitted By</div>
                    <div className="info-value">{complaint.createdBy?.name}</div>
                  </div>
                </div>

                <div className="info-item">
                  <FiClock />
                  <div>
                    <div className="info-label">Submitted</div>
                    <div className="info-value">
                      {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>

              {complaint.images && complaint.images.length > 0 && (
                <div className="info-section">
                  <h3>Attached Images</h3>
                  <div className="image-gallery">
                    {complaint.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`Complaint image ${index + 1}`}
                        className="complaint-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* History Timeline */}
              {complaint.history && complaint.history.length > 0 && (
                <div className="info-section">
                  <h3>Activity History</h3>
                  <div className="timeline">
                    {complaint.history.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <div className="timeline-action">{item.action}</div>
                          {item.note && <div className="timeline-note">{item.note}</div>}
                          <div className="timeline-meta">
                            {item.by?.name} · {format(new Date(item.timestamp), 'PPp')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="detail-sidebar">
              {/* Assignment Info */}
              <div className="sidebar-card">
                <h3>Assignment</h3>
                {complaint.assignedTo ? (
                  <div className="assigned-info">
                    <div className="assigned-avatar">👤</div>
                    <div>
                      <div className="assigned-name">{complaint.assignedTo.name}</div>
                      <div className="assigned-role">Technician</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">Not assigned yet</p>
                )}

                {canAssign && (
                  <div className="assign-section">
                    <select
                      value={assignTechnicianId}
                      onChange={(e) => setAssignTechnicianId(e.target.value)}
                      disabled={updating}
                    >
                      <option value="">Assign to technician...</option>
                      {technicians.map(tech => (
                        <option key={tech._id} value={tech._id}>
                          {tech.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignTechnician}
                      disabled={!assignTechnicianId || updating}
                      className="btn-secondary"
                    >
                      Assign
                    </button>
                  </div>
                )}
              </div>

              {/* Status Update */}
              {canUpdateStatus && (
                <div className="sidebar-card">
                  <h3>Update Status</h3>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={updating}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    {user?.role === 'admin' && (
                      <option value="rejected">Rejected</option>
                    )}
                  </select>

                  <textarea
                    placeholder="Add a note (optional)"
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    rows={3}
                    disabled={updating}
                  />

                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating || newStatus === complaint.status}
                    className="btn-primary btn-full"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetail
