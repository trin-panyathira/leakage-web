import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/WaitingApprove.css'

interface LocationState {
  caId: string
  requestId: number
}

export function WaitingApprove() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!state || !state.caId) {
      navigate('/')
    }
  }, [state, navigate])

  const handleBackToHome = () => {
    navigate('/')
  }

  if (!state || !state.caId) {
    return null
  }

  return (
    <div className="waiting-approve-container">
      <div className="waiting-approve-card">
        <h1 className="waiting-approve-title">
          กรุณารอผลการพิจารณา<br />ภายใน <span className="highlight">1-2 Day</span>
        </h1>
        
        <div className="waiting-approve-icon">
          <svg viewBox="0 0 300 300" className="time-icons">
            {/* Clock */}
            <g>
              {/* Clock circle */}
              <circle cx="100" cy="150" r="70" fill="white" stroke="#3b82f6" strokeWidth="6" />
              
              {/* Clock ticks */}
              <line x1="100" y1="85" x2="100" y2="95" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              <line x1="165" y1="150" x2="155" y2="150" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              <line x1="100" y1="215" x2="100" y2="205" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              <line x1="35" y1="150" x2="45" y2="150" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              
              {/* Clock hands */}
              <line x1="100" y1="150" x2="100" y2="110" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
              <line x1="100" y1="150" x2="130" y2="150" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
              
              {/* Center dot */}
              <circle cx="100" cy="150" r="6" fill="#3b82f6" />
            </g>
            
            {/* Hourglass */}
            <g>
              {/* Hourglass outline */}
              <path
                d="M 180 100 L 180 90 L 250 90 L 250 100 L 240 110 L 240 190 L 250 200 L 250 210 L 180 210 L 180 200 L 190 190 L 190 110 Z"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              
              {/* Top sand */}
              <path
                d="M 185 95 L 245 95 L 235 105 L 195 105 Z"
                fill="#3b82f6"
              />
              
              {/* Bottom sand */}
              <path
                d="M 195 195 L 235 195 L 235 205 L 195 205 Z"
                fill="#3b82f6"
              />
              
              {/* Middle sand */}
              <circle cx="215" cy="150" r="8" fill="#3b82f6" />
              
              {/* Sand falling lines */}
              <line x1="215" y1="110" x2="215" y2="140" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5" />
            </g>
          </svg>
        </div>

        <p className="waiting-approve-message">
          ระบบจะส่ง Noti ผ่าน Email ของท่านหากผลการพิจารณาเสร็จสิ้น
        </p>

        <button onClick={handleBackToHome} className="back-home-btn">
          Back to Home
        </button>
      </div>
    </div>
  )
}

