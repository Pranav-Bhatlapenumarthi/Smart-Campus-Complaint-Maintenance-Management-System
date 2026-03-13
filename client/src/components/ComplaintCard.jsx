import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import './ComplaintCard.css'

const ComplaintCard = ({ complaint }) => {
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

  const getPriorityIcon = (priority) => {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🔴'
    }
    return icons[priority] || '⚪'
  }

  const status = getStatusBadge(complaint.status)
  const timeAgo = formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })

  return (
    <Link to={`/complaint/${complaint._id}`} className="complaint-card">
      <div className="complaint-card-header">
        <div className="complaint-id">
          #{complaint.complaintId || complaint._id.slice(-6)}
        </div>
        <span className={`badge ${status.class}`}>{status.label}</span>
      </div>

      <h3 className="complaint-title">
        {getPriorityIcon(complaint.priority)} {complaint.title}
      </h3>

      <p className="complaint-description">
        {complaint.description.length > 100
          ? `${complaint.description.substring(0, 100)}...`
          : complaint.description}
      </p>

      <div className="complaint-meta">
        <div className="meta-item">
          <FiMapPin />
          <span>{complaint.location}</span>
        </div>
        <div className="meta-item">
          <FiAlertCircle />
          <span>{complaint.category}</span>
        </div>
        <div className="meta-item">
          <FiClock />
          <span>{timeAgo}</span>
        </div>
      </div>

      {complaint.assignedTo && (
        <div className="complaint-assignee">
          Assigned to: <strong>{complaint.assignedTo.name}</strong>
        </div>
      )}
    </Link>
  )
}

export default ComplaintCard
