import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ChatbotWidget from './components/ChatbotWidget.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import TrackAppointment from './pages/TrackAppointment.jsx'
import { About, Contact, Services } from './pages/InfoPages.jsx'
import DoctorPortal, { DoctorLogin, DoctorProtected } from './pages/DoctorPortal.jsx'

export default function App() {
  return <Routes>
    <Route path="/doctor/login" element={<DoctorLogin/>}/>
    <Route path="/doctor/*" element={<DoctorProtected><DoctorRoutes/></DoctorProtected>}/>
    <Route path="*" element={<><Header/><main><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/doctors" element={<Doctors/>}/><Route path="/services" element={<Services/>}/><Route path="/contact" element={<Contact/>}/><Route path="/track" element={<TrackAppointment/>}/><Route path="*" element={<Home/>}/></Routes></main><Footer/><ChatbotWidget/></>}/>
  </Routes>
}

function DoctorRoutes() {
  return <Routes>
    <Route path="dashboard" element={<DoctorPortal page="/doctor/dashboard"/>}/>
    <Route path="appointments" element={<DoctorPortal page="/doctor/appointments"/>}/>
    <Route path="schedule" element={<DoctorPortal page="/doctor/schedule"/>}/>
    <Route path="checkins" element={<DoctorPortal page="/doctor/checkins"/>}/>
    <Route path="availability" element={<DoctorPortal page="/doctor/availability"/>}/>
    <Route path="prescriptions" element={<DoctorPortal page="/doctor/prescriptions"/>}/>
    <Route path="analytics" element={<DoctorPortal page="/doctor/analytics"/>}/>
    <Route path="profile" element={<DoctorPortal page="/doctor/profile"/>}/>
    <Route path="*" element={<DoctorPortal page="/doctor/dashboard"/>}/>
  </Routes>
}
