const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://niki-hospital-backend-api.onrender.com').replace(/\/+$/, '')
const TOKEN_KEY = 'careone_doctor_token'
const STAFF_TOKEN_KEY = 'careone_staff_token'

export const staffSession = {
  getToken() { return sessionStorage.getItem(STAFF_TOKEN_KEY) },
  save(token) { sessionStorage.setItem(STAFF_TOKEN_KEY, token) },
  clear() { sessionStorage.removeItem(STAFF_TOKEN_KEY) },
}

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
  async loginStaff(credentials) { return request('/api/staff/auth/login', { method: 'POST', body: JSON.stringify(credentials) }) },
}

async function staffRequest(path, options = {}) {
  if (!API_BASE_URL) throw new Error('The hospital appointment service is not configured.')
  let response
  try { response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(staffSession.getToken() ? { Authorization: `Bearer ${staffSession.getToken()}` } : {}), ...options.headers } }) }
  catch { throw new Error('Unable to connect to the hospital appointment service. Please try again later.') }
  let data
  try { data = await response.json() } catch { data = {} }
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || friendlyError(response.status, data.errorCode)); error.status = response.status; error.code = data.errorCode
    if (response.status === 401) { staffSession.clear(); window.dispatchEvent(new Event('staff-session-expired')) }
    throw error
  }
  return data
}

export const staffService = {
  async me() { return staffRequest('/api/staff/me') },
  async adminDashboard(params = '') { return staffRequest(`/api/admin/dashboard${params ? `?${params}` : ''}`) },
  async adminAppointments(params = '') { return staffRequest(`/api/admin/appointments${params ? `?${params}` : ''}`) },
  async adminDoctors(params = '') { return addDoctorLocations(await staffRequest(`/api/admin/doctors${params ? `?${params}` : ''}`)) },
  async adminAvailability(params = '') { return addDoctorLocations(await staffRequest(`/api/admin/doctors/availability${params ? `?${params}` : ''}`)) },
  async adminLeaves(params = '') { return staffRequest(`/api/admin/doctors/on-leave${params ? `?${params}` : ''}`) },
  async adminStaff(params = '') { return staffRequest(`/api/admin/staff${params ? `?${params}` : ''}`) },
  async createStaff(staff) { return staffRequest('/api/staff', { method: 'POST', body: JSON.stringify(staff) }) },
  async adminReports(params = '') { return staffRequest(`/api/admin/reports${params ? `?${params}` : ''}`) },
  async receptionAppointments(params = '') { return staffRequest(`/api/reception/appointments${params ? `?${params}` : ''}`) },
  async checkIn(id) { return staffRequest(`/api/appointments/${encodeURIComponent(id)}/check-in`, { method: 'POST' }) },
  async noShow(id) { return staffRequest(`/api/appointments/${encodeURIComponent(id)}/no-show`, { method: 'POST' }) },
  async completed(params = '') { return staffRequest(`/api/medical-center/completed-appointments${params ? `?${params}` : ''}`) },
  async prescription(id) { return staffRequest(`/api/medical-center/appointments/${encodeURIComponent(id)}/prescription`) },
}

async function addDoctorLocations(result) {
  const rows = Array.isArray(result?.data) ? result.data : Array.isArray(result?.doctors) ? result.doctors : []
  try {
    const directory = await doctorService.list()
    const locations = new Map(directory.map((doctor) => [doctor.doctorId, doctor.location || doctor.hospital || null]))
    const enriched = rows.map((doctor) => ({ ...doctor, location: doctor.location || locations.get(doctor.doctorId) || null }))
    return Array.isArray(result?.data) ? { ...result, data: enriched } : { ...result, doctors: enriched }
  } catch {
    return result
  }
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
