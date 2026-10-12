import { useEffect, useState } from 'react'
import Icon from './Icons.jsx'

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sentMessage, setSentMessage] = useState('')
  useEffect(() => {
    const showAssistant = () => setOpen(true)
    window.addEventListener('open-care-assistant', showAssistant)
    return () => window.removeEventListener('open-care-assistant', showAssistant)
  }, [])
  function submit(event) { event.preventDefault(); if (message.trim()) { setSentMessage(message.trim()); setMessage('') } }
  return <div className="chat-widget">
    {open && <section className="chat-panel" aria-label="Nikhil CareOne Assistant">
      <div className="chat-head"><span className="chat-avatar"><Icon name="heart" size={20}/></span><div><strong>NIKHIL CAREONE ASSISTANT</strong><small>Here to help you get started</small></div><button onClick={() => setOpen(false)} aria-label="Close assistant"><Icon name="close" size={18}/></button></div>
      <div className="chat-body"><div className="chat-bubble">Hello! How can I help you today? Appointment booking will be available here when the Artemis assistant is connected.</div>{sentMessage && <><div className="chat-bubble chat-bubble-user">{sentMessage}</div><p className="chat-note">Artemis chat connection will be available here soon.</p></>}</div>
      <form className="chat-form" onSubmit={submit}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." aria-label="Type your message"/><button type="submit" aria-label="Send message"><Icon name="arrow" size={18}/></button></form>
      <p className="chat-powered">A future Artemis connection point</p>
    </section>}
    <button className="chat-launch" onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open chat'}><Icon name={open ? 'close' : 'chat'} size={21}/><span>{open ? 'Close' : 'Need help?'}</span></button>
  </div>
}
