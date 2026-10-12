const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

async function request(path, options = {}) {
  if (!API_BASE_URL) throw new Error('The hospital appointment service is not configured.')
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    })
  } catch {
    throw new Error('Unable to connect to the hospital appointment service. Please try again later.')
  }
  let data
  try { data = await response.json() } catch { data = {} }
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || 'The request could not be completed. Please try again.')
    error.status = response.status
    error.code = data.errorCode
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
}
