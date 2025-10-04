import { useState } from 'react'
import { searchByIdCard, getUserInfo, createLeakageRequest } from '../state/requests'
import { useAuth } from '../state/auth'
import { CAItem, UserInfo, LeakageRequest } from '../types'

export function MakeRequest() {
  const { user } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Step 1: ID Card Search
  const [idCard, setIdCard] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  // Step 2: CA List
  const [caList, setCaList] = useState<CAItem[]>([])
  const [showCaList, setShowCaList] = useState(false)
  const [selectedCa, setSelectedCa] = useState<CAItem | null>(null)
  
  // Step 3: User Information
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showUserInfo, setShowUserInfo] = useState(false)
  
  // Step 4: Leakage Request
  const [leakageRequest, setLeakageRequest] = useState<LeakageRequest>({
    newLoanAmount: 0,
    requestNewLoanRate1st: 0,
    requestNewLoanRate2nd: 0,
    requestNewLoanRate3rd: 0
  })

  const handleIdCardSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || idCard.length !== 13) {
      setError('Please enter a valid 13-digit ID Card number')
      return
    }
    
    setIsSearching(true)
    setError(null)
    try {
      const results = await searchByIdCard(idCard, user)
      setCaList(results)
      setShowCaList(true)
      setMessage(null)
    } catch (err) {
      setError('Failed to search ID Card. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCA = async (ca: CAItem) => {
    if (!user) return
    
    setSelectedCa(ca)
    setShowCaList(false)
    
    try {
      const info = await getUserInfo(ca.caId, user)
      setUserInfo(info)
      setShowUserInfo(true)
    } catch (err) {
      setError('Failed to load user information. Please try again.')
    }
  }

  const handleLeakageRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedCa || !userInfo) return
    
    try {
      const res = await createLeakageRequest({
        ...leakageRequest,
        caId: selectedCa.caId,
        userInfo
      }, user)
      
      setMessage(`Created leakage request #${res.id}`)
      // Reset form
      setIdCard('')
      setCaList([])
      setShowCaList(false)
      setSelectedCa(null)
      setUserInfo(null)
      setShowUserInfo(false)
      setLeakageRequest({
        newLoanAmount: 0,
        requestNewLoanRate1st: 0,
        requestNewLoanRate2nd: 0,
        requestNewLoanRate3rd: 0
      })
    } catch (err) {
      setError('Failed to create leakage request. Please try again.')
    }
  }

  return (
    <div className="card">
      <h2>Make Leakage Request</h2>
      
      {/* Step 1: ID Card Search */}
      <div className="section">
        <h3>Search ID Card</h3>
        <form onSubmit={handleIdCardSearch} className="form">
          <label>
            ID Card (13 digits)
            <input 
              type="text" 
              value={idCard} 
              onChange={e => setIdCard(e.target.value.replace(/\D/g, '').slice(0, 13))}
              placeholder="Enter 13-digit ID Card number"
              maxLength={13}
              required 
            />
          </label>
          <button type="submit" disabled={isSearching || idCard.length !== 13}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Step 2: CA List */}
      {showCaList && (
        <div className="section">
          <h3>CA List</h3>
          {caList.length === 0 ? (
            <p>No CA records found for this ID Card.</p>
          ) : (
            <div className="ca-list">
              {caList.map((ca, index) => (
                <div key={index} className="ca-item">
                  <div className="ca-details">
                    <div><strong>CA ID:</strong> {ca.caId}</div>
                    <div><strong>Name:</strong> {ca.firstName} {ca.lastName}</div>
                    <div><strong>Loan Amount:</strong> {ca.loanAmount.toLocaleString()}</div>
                  </div>
                  <button onClick={() => handleSelectCA(ca)} className="select-btn">
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: User Information */}
      {showUserInfo && userInfo && (
        <div className="section">
          <h3>User Information</h3>
          <div className="user-info-grid">
            <div className="form-group">
              <label>First Name</label>
              <input value={userInfo.firstName} disabled />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={userInfo.lastName} disabled />
            </div>
            <div className="form-group">
              <label>Advisor</label>
              <input value={userInfo.advisor} disabled />
            </div>
            <div className="form-group">
              <label>Tel</label>
              <input value={userInfo.tel} disabled />
            </div>
            <div className="form-group">
              <label>Loan Amount</label>
              <input value={userInfo.loanAmount.toLocaleString()} disabled />
            </div>
            <div className="form-group">
              <label>Current Loan Rate 1st</label>
              <input value={userInfo.currentLoanRate1st} disabled />
            </div>
            <div className="form-group">
              <label>Current Loan Rate 2nd</label>
              <input value={userInfo.currentLoanRate2nd} disabled />
            </div>
            <div className="form-group">
              <label>Current Loan Rate 3rd</label>
              <input value={userInfo.currentLoanRate3rd} disabled />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Leakage Request */}
      {showUserInfo && (
        <div className="section">
          <h3>Leakage Request</h3>
          <form onSubmit={handleLeakageRequestSubmit} className="form">
            <div className="form-group">
              <label>New Loan Amount</label>
              <input 
                type="number" 
                value={leakageRequest.newLoanAmount || ''} 
                onChange={e => setLeakageRequest(prev => ({ ...prev, newLoanAmount: Number(e.target.value) }))}
                required 
              />
            </div>
            <div className="form-group">
              <label>Request New Loan Rate 1st</label>
              <input 
                type="number" 
                step="0.01"
                value={leakageRequest.requestNewLoanRate1st || ''} 
                onChange={e => setLeakageRequest(prev => ({ ...prev, requestNewLoanRate1st: Number(e.target.value) }))}
                required 
              />
            </div>
            <div className="form-group">
              <label>Request New Loan Rate 2nd</label>
              <input 
                type="number" 
                step="0.01"
                value={leakageRequest.requestNewLoanRate2nd || ''} 
                onChange={e => setLeakageRequest(prev => ({ ...prev, requestNewLoanRate2nd: Number(e.target.value) }))}
                required 
              />
            </div>
            <div className="form-group">
              <label>Request New Loan Rate 3rd</label>
              <input 
                type="number" 
                step="0.01"
                value={leakageRequest.requestNewLoanRate3rd || ''} 
                onChange={e => setLeakageRequest(prev => ({ ...prev, requestNewLoanRate3rd: Number(e.target.value) }))}
                required 
              />
            </div>
            <button type="submit">Submit Leakage Request</button>
          </form>
        </div>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
} 