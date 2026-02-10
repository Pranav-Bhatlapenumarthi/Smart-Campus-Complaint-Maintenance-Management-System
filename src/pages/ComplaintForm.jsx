import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { FiAlertCircle, FiCheckCircle, FiUpload, FiX } from 'react-icons/fi'
import './ComplaintForm.css'

const ComplaintForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium'
  })
  const [images, setImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = [
    'Electrical',
    'Plumbing',
    'HVAC',
    'Infrastructure',
    'IT/Network',
    'Furniture',
    'Cleaning',
    'Safety',
    'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    setImages([...images, ...files])
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviews])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviewUrls(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })
      
      images.forEach(image => {
        submitData.append('images', image)
      })

      const response = await axios.post('/api/complaints', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess(true)
      setTimeout(() => {
        navigate(`/complaint/${response.data.complaint._id}`)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="form-container">
          <div className="success-card fade-in">
            <FiCheckCircle className="success-icon" />
            <h2>Complaint Submitted Successfully!</h2>
            <p>Redirecting you to complaint details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <div className="form-container">
        <div className="form-card fade-in">
          <div className="form-header">
            <h1>Submit New Complaint</h1>
            <p>Provide detailed information about the maintenance issue</p>
          </div>

          {error && (
            <div className="error-message">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Complaint Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Building, Room number, etc."
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority Level</label>
                <div className="priority-selector">
                  {['low', 'medium', 'high'].map(level => (
                    <label key={level} className="priority-option">
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={formData.priority === level}
                        onChange={handleChange}
                      />
                      <span className={`priority-badge priority-${level}`}>
                        {level === 'low' && '🟢'}
                        {level === 'medium' && '🟡'}
                        {level === 'high' && '🔴'}
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the issue, including any relevant context..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Images (Optional, max 5)</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <label htmlFor="images" className="upload-label">
                  <FiUpload />
                  <span>Click to upload or drag and drop</span>
                  <span className="upload-hint">PNG, JPG up to 5MB each</span>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="image-previews">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="preview-item">
                      <img src={url} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ComplaintForm
