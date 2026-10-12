import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import Icon from './Icons.jsx'

const links = [['Home', '/'], ['About', '/about'], ['Doctors', '/doctors'], ['Services', '/services'], ['Contact', '/contact']]

export default function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header">
    <div className="container header-inner">
      <Link to="/" className="brand" onClick={close} aria-label="Nikhil CareOne for healthcare home">
        <BrandMark />
        <span className="brand-name">Nikhil CareOne <small>for healthcare</small></span>
      </Link>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}><Icon name={open ? 'close' : 'menu'} size={23}/></button>
      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <div className="nav-links">{links.map(([label, to]) => <NavLink key={to} to={to} onClick={close} end={to === '/'}>{label}</NavLink>)}</div>
        <Link className="button button-primary nav-cta" to="/track" onClick={close}>Track Appointment <Icon name="arrow" size={16}/></Link>
      </nav>
    </div>
  </header>
}
