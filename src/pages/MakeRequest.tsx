import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchByIdCard, searchByName, getUserInfo, createLeakageRequest } from '../state/requests'
import { useAuth } from '../state/auth'
import { CAItem, UserInfo, LeakageRequest } from '../types'

export function MakeRequest() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Search (ID Card or Name)
  const [idCard, setIdCard] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(true)

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const hasIdCard = idCard.trim().length > 0
    const hasFirstName = firstName.trim().length > 0
    const hasLastName = lastName.trim().length > 0

    setIsSearching(true)
    setError(null)
    try {
      let results: CAItem[] = []

      // If no input, search all (empty search returns all)
      if (!hasIdCard && !hasFirstName && !hasLastName) {
        results = await searchByName('', '', user)
      } else {
        // AND logic: Start with all results, then filter by each condition
        let filteredResults = await searchByName('', '', user)

        // Filter by ID Card if provided
        if (hasIdCard) {
          filteredResults = filteredResults.filter(item => item.idCard === idCard)
        }

        // Filter by First Name if provided
        if (hasFirstName) {
          const firstNameLower = firstName.toLowerCase().trim()
          filteredResults = filteredResults.filter(item =>
            item.firstName.toLowerCase().includes(firstNameLower)
          )
        }

        // Filter by Last Name if provided
        if (hasLastName) {
          const lastNameLower = lastName.toLowerCase().trim()
          filteredResults = filteredResults.filter(item =>
            item.lastName.toLowerCase().includes(lastNameLower)
          )
        }

        results = filteredResults
      }

      setCaList(results)
      setShowCaList(true)
      setMessage(null)
    } catch (err) {
      setError('Failed to search. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCA = async (ca: CAItem) => {
    if (!user) return

    setSelectedCa(ca)
    setShowCaList(false)
    setShowSearch(false)

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

      // Check if auto-approved
      if (res.status === 'APPROVED') {
        // Navigate to approved page
        navigate('/approved', {
          state: {
            caId: selectedCa.caId,
            requestId: res.id
          }
        })
      } else {
        // Navigate to waiting-approve page
        navigate('/waiting-approve', {
          state: {
            caId: selectedCa.caId,
            requestId: res.id
          }
        })
      }
    } catch (err) {
      setError('Failed to create leakage request. Please try again.')
    }
  }

  return (
    <div className="card">
      <h2>Make Leakage Request</h2>
      
      {/* Step 1: Search by ID Card or Name */}
      {showSearch && (
        <div className="section">
          <h3>Search Customer</h3>

          <form onSubmit={handleSearch} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>ID Card</label>
                <input
                  type="text"
                  value={idCard}
                  onChange={e => setIdCard(e.target.value.replace(/\D/g, '').slice(0, 13))}
                  placeholder="13-digit ID Card"
                  maxLength={13}
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: CA List */}
      {showSearch && showCaList && (
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
                    <div><strong>ID Card:</strong> {ca.idCard}</div>
                    <div><strong>Account Number:</strong> {ca.accountNumber}</div>
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
            <div className="leakage-request-inline">
              <div className="form-group-inline">
                <label>New Loan Amount</label>
                <input
                  type="number"
                  value={leakageRequest.newLoanAmount || ''}
                  onChange={e => setLeakageRequest(prev => ({ ...prev, newLoanAmount: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="form-group-inline">
                <label>Rate 1st</label>
                <input
                  type="number"
                  step="0.01"
                  value={leakageRequest.requestNewLoanRate1st || ''}
                  onChange={e => setLeakageRequest(prev => ({ ...prev, requestNewLoanRate1st: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="form-group-inline">
                <label>Rate 2nd</label>
                <input
                  type="number"
                  step="0.01"
                  value={leakageRequest.requestNewLoanRate2nd || ''}
                  onChange={e => setLeakageRequest(prev => ({ ...prev, requestNewLoanRate2nd: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="form-group-inline">
                <label>Rate 3rd</label>
                <input
                  type="number"
                  step="0.01"
                  value={leakageRequest.requestNewLoanRate3rd || ''}
                  onChange={e => setLeakageRequest(prev => ({ ...prev, requestNewLoanRate3rd: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
            <button type="submit">Submit Leakage Request</button>
          </form>
        </div>
      )}

      {message && <p className="success-txn">{message}</p>}
      {error && <p className="error-txn">{error}</p>}
    </div>
  )
} 