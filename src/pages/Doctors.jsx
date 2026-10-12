import { useEffect, useState } from 'react'
import DoctorCard from '../components/DoctorCard.jsx'
import PageIntro from '../components/PageIntro.jsx'
import { EmptyState, ErrorNotice, Loading } from '../components/States.jsx'
import { doctorService } from '../services/api.js'

export default function Doctors() {
  const [doctors, setDoctors] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [filter, setFilter] = useState('All specialties')
  async function load() { setLoading(true); setError(''); try { setDoctors(await doctorService.list()) } catch (e) { setError(e.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const specialties = ['All specialties', ...new Set(doctors.map((d) => d.specialization).filter(Boolean))]
  const shown = filter === 'All specialties' ? doctors : doctors.filter((d) => d.specialization === filter)
  return <><PageIntro label="Our care team" title="Meet our doctors" description="Explore the doctors and specialties available through our appointment service. Choose a doctor to see real booking dates and times."/><section className="section doctors-page"><div className="container"><div className="doctors-toolbar"><div><span className="eyebrow">The people behind your care</span><h2>{loading ? 'Find your doctor' : `${shown.length} ${shown.length === 1 ? 'doctor' : 'doctors'} to explore`}</h2></div><label className="filter-label">Specialty<select value={filter} onChange={(e) => setFilter(e.target.value)}>{specialties.map((name) => <option key={name}>{name}</option>)}</select></label></div>{loading ? <Loading>Loading doctors...</Loading> : error ? <ErrorNotice onRetry={load}>{error}</ErrorNotice> : shown.length ? <div className="doctor-grid">{shown.map((doctor) => <DoctorCard key={doctor.doctorId} doctor={doctor}/>)}</div> : <EmptyState title="No doctors in this specialty" text="Choose a different specialty to explore our doctors."/>}<p className="data-note">Doctor details and appointment availability are provided by the appointment service.</p></div></section></>
}
