import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ChatbotWidget from './components/ChatbotWidget.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import TrackAppointment from './pages/TrackAppointment.jsx'
import { About, Contact, Services } from './pages/InfoPages.jsx'

export default function App() {
  return <><Header/><main><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/doctors" element={<Doctors/>}/><Route path="/services" element={<Services/>}/><Route path="/contact" element={<Contact/>}/><Route path="/track" element={<TrackAppointment/>}/><Route path="*" element={<Home/>}/></Routes></main><Footer/><ChatbotWidget/></>
}
