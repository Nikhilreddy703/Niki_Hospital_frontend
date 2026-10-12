export default function PageIntro({ label, title, description }) {
  return <section className="page-intro"><div className="container"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{description}</p></div></section>
}
