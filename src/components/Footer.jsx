import { Link } from 'react-router-dom'
import Icon from './Icons.jsx'

export default function Footer() {
  return <footer className="site-footer" id="contact">
    <div className="container footer-grid">
      <div className="footer-brand"><Link to="/" className="brand brand-light"><span className="brand-mark"><Icon name="plus" size={22}/></span><span className="brand-name">NIKHIL CENTER <small>FOR HEALTH CARE</small></span></Link><p>Thoughtful care starts with a simple connection.</p></div>
      <div><h3>Explore</h3><div className="footer-links"><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/doctors">Doctors</Link><Link to="/services">Services</Link><Link to="/track">Track Appointment</Link></div></div>
      <div><h3>Get in touch</h3><div className="footer-contact"><p><Icon name="pin" size={17}/>2-60/A, Lingampally,<br/>Hyderabad, Telangana - 500019</p><a href="tel:+917032369119"><Icon name="phone" size={16}/>+91 7032369119</a></div></div>
    </div>
    <div className="container footer-bottom"><span>© 2026 NIKHIL CENTER FOR HEALTH CARE</span><span>Care, made more convenient.</span></div>
  </footer>
}
