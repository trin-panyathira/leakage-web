import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/NLeadsRequest.css'

interface LocationState {
  caId: string
  requestId: number
}

export function NLeadsRequest() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  useEffect(() => {
    // Redirect to home if no state is provided
    if (!state || !state.caId) {
      navigate('/')
    }
  }, [state, navigate])

  const handleConfirm = () => {
    // TODO: Send request to NLEADs system
    alert('Request sent to NLEADs system successfully!')
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (!state || !state.caId) {
    return null
  }

  return (
    <div className="nleads-container">
      <div className="nleads-card">
        <h1 className="nleads-title">
          ยืนยันเพื่อส่งข้อมูลเข้า<br />ระบบ NLEADs
        </h1>
        
        <div className="nleads-icon">
          <svg viewBox="0 0 200 200" className="document-icon">
            {/* Document outline */}
            <path
              d="M 60 40 L 60 160 L 140 160 L 140 70 L 110 40 Z"
              fill="white"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Folded corner */}
            <path
              d="M 110 40 L 110 70 L 140 70"
              fill="#e5e7eb"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Document lines */}
            <line x1="70" y1="90" x2="110" y2="90" stroke="#374151" strokeWidth="3" />
            <line x1="70" y1="105" x2="130" y2="105" stroke="#374151" strokeWidth="3" />
            <line x1="70" y1="120" x2="130" y2="120" stroke="#374151" strokeWidth="3" />
            
            {/* Green arrow */}
            <path
              d="M 120 130 L 150 130 L 150 120 L 170 135 L 150 150 L 150 140 L 120 140 Z"
              fill="#16a34a"
            />
          </svg>
        </div>

        <div className="nleads-buttons">
          <button onClick={handleConfirm} className="confirm-btn">
            ยืนยัน
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )
}

