import Icon from './Icons.jsx'
import { openCareAssistant } from '../utils/chat.js'

const initials = (name = '') => name.replace(/^Dr\.\s*/i, '').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export default function DoctorCard({ doctor }) {
  const available = doctor.availabilityStatus === 'AVAILABLE'
  return <article className="doctor-card">
    <div className="doctor-card-top"><div className="doctor-avatar">{initials(doctor.name)}</div><span className={`status-pill ${available ? 'status-available' : 'status-away'}`}><i/>{available ? 'Available' : doctor.availabilityStatus?.replaceAll('_', ' ')}</span></div>
    <div className="doctor-copy"><span className="eyebrow">{doctor.department}</span><h3>{doctor.name}</h3><p>{doctor.specialization}</p></div>
    <div className="doctor-meta">
      {doctor.experienceYears != null && <span><Icon name="shield" size={16}/>{doctor.experienceYears} years experience</span>}
      {doctor.consultationFee != null && <span className="doctor-fee">{doctor.currency === 'INR' ? '₹' : ''}{doctor.consultationFee}<small> / consultation</small></span>}
      {doctor.location && <span><Icon name="pin" size={16}/>{doctor.location}</span>}
    </div>
    {available ? <button className="button button-outline" type="button" onClick={openCareAssistant}>Ask assistant about booking <Icon name="chat" size={16}/></button> : <button className="button button-disabled" type="button" disabled>Currently unavailable</button>}
  </article>
}
