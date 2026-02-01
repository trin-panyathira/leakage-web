import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Approved.css'

interface LocationState {
  caId: string
  requestId: number
}

export function Approved() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!state || !state.caId) {
      navigate('/')
    }
  }, [state, navigate])

  const handleNext = () => {
    navigate('/nleads-request', {
      state: {
        caId: state.caId,
        requestId: state.requestId
      }
    })
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  if (!state || !state.caId) {
    return null
  }

  return (
    <div className="approved-container">
      <div className="approved-card">
        <h1 className="approved-title">Make Leakage<br />Request</h1>

        <div className="approved-icon">
          <svg viewBox="0 0 200 200" className="approval-badge">
            {/* Green badge background */}
            <rect x="20" y="120" width="160" height="60" rx="8" fill="#6BBE4A" />

            {/* Location pin shape */}
            <path
              d="M 100 50
                 C 75 50, 55 70, 55 95
                 C 55 110, 65 125, 100 160
                 C 135 125, 145 110, 145 95
                 C 145 70, 125 50, 100 50 Z"
              fill="#6BBE4A"
              opacity="0.8"
            />

            {/* White circle inside pin */}
            <ellipse cx="100" cy="95" rx="30" ry="35" fill="white" />

            {/* Green checkmark */}
            <path
              d="M 85 95 L 95 105 L 115 80"
              stroke="#6BBE4A"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* APPROVED text */}
            <text
              x="100"
              y="155"
              fontSize="28"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
            >
              APPROVED
            </text>
          </svg>
        </div>

        <p className="approved-message">
          CA {state.caId} Auto approved
        </p>

        <div className="approved-buttons">
          <button onClick={handleNext} className="next-btn">
            Next
          </button>
          <button onClick={handleBackToHome} className="back-home-btn">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

