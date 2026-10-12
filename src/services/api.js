const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const TOKEN_KEY = 'careone_doctor_token'

export const doctorSession = {
  getToken() { return sessionStorage.getItem(TOKEN_KEY) },
  save(token) { sessionStorage.setItem(TOKEN_KEY, token) },
  clear() { sessionStorage.removeItem(TOKEN_KEY) },
}

const friendlyError = (status, code) => {
  if (code === 'INVALID_CREDENTIALS' || code === 'INVALID_DOCTOR_CREDENTIALS') return 'Invalid doctor credentials.'
  if (status === 401) return 'Your session has expired. Please log in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested record could not be found.'
  if (status === 409) return code === 'ALREADY_CHECKED_IN' ? 'You have already checked in.' : 'This action is not available for the current appointment or status.'
  if (status >= 500) return 'The hospital service is temporarily unavailable. Please try again.'
  return 'The request could not be completed. Please check your information and try again.'
}

async function request(path, options = {}, authenticated = false) {
  if (!API_BASE_URL) throw new Error('The hospital appointment service is not configured.')
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(authenticated && doctorSession.getToken() ? { Authorization: `Bearer ${doctorSession.getToken()}` } : {}), ...options.headers },
    })
  } catch {
    throw new Error('Unable to connect to the hospital appointment service. Please try again later.')
  }
  let data
  try { data = await response.json() } catch { data = {} }
  if (!response.ok || data.success === false) {
    const error = new Error(friendlyError(response.status, data.errorCode))
    error.status = response.status
    error.code = data.errorCode
    if (response.status === 401 && authenticated) {
      doctorSession.clear()
      window.dispatchEvent(new Event('doctor-session-expired'))
    }
    throw error
  }
  return data
}

export const doctorService = {
  async list() { const data = await request('/api/doctors'); return data.doctors || [] },
  async availableDates(id) { const data = await request(`/api/doctors/${encodeURIComponent(id)}/available-dates`); return data.availableDates || [] },
  async slots(id, date) {
    const query = date ? `?date=${encodeURIComponent(date)}` : ''
    const data = await request(`/api/doctors/${encodeURIComponent(id)}/slots${query}`)
    return data.availableSlots || []
  },
}

export const appointmentService = {
  async getById(id) { return request(`/api/appointments/${encodeURIComponent(id.trim())}`) },
  async patientCheckIn(id) { return request(`/api/appointments/${encodeURIComponent(id.trim())}/check-in`, { method: 'POST' }) },
  async startConsultation(id) { return request(`/api/appointments/${encodeURIComponent(id)}/start-consultation`, { method: 'POST' }, true) },
  async completeConsultation(id) { return request(`/api/appointments/${encodeURIComponent(id)}/complete`, { method: 'POST' }, true) },
  async addPrescription(id, prescription) { return request(`/api/appointments/${encodeURIComponent(id)}/prescription`, { method: 'POST', body: JSON.stringify(prescription) }, true) },
}

export const authService = {
  async loginDoctor(credentials) { return request('/api/doctors/login', { method: 'POST', body: JSON.stringify(credentials) }) },
}

export const doctorPortalService = {
  async getProfile() { return request('/api/doctors/me', {}, true) },
  async updateStatus(status) { return request('/api/doctors/me/status', { method: 'PATCH', body: JSON.stringify({ status }) }, true) },
  async checkIn() { return request('/api/doctors/me/check-in', { method: 'POST' }, true) },
  async checkOut() { return request('/api/doctors/me/check-out', { method: 'POST' }, true) },
  async getLeave() { return request('/api/doctors/me/leave', {}, true) },
  async addLeave(leave) { return request('/api/doctors/me/leave', { method: 'POST', body: JSON.stringify(leave) }, true) },
  async cancelLeave(id) { return request(`/api/doctors/me/leave/${encodeURIComponent(id)}`, { method: 'DELETE' }, true) },
  async getAvailability() { return request('/api/doctors/me/availability', {}, true) },
  async getAppointments(params = '') { return request(`/api/doctors/me/appointments${params ? `?${params}` : ''}`, {}, true) },
  async getTodayAppointments() { return request('/api/doctors/me/appointments/today', {}, true) },
  async getCheckIns() { return request('/api/doctors/me/check-ins', {}, true) },
  async getAnalytics(range = 'today') { return request(`/api/doctors/me/analytics?range=${encodeURIComponent(range)}`, {}, true) },
}
