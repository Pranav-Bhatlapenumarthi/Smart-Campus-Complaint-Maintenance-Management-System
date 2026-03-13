import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    )
  }

  return (
    <div className="spinner-inline">
      <div className="spinner"></div>
    </div>
  )
}

export default LoadingSpinner
