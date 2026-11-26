import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'

const TABS = [
  { id: 'flights', label: 'Flights', icon: 'Plane', fields: [['from', 'From', 'Karachi (KHI)'], ['to', 'To', 'Dubai (DXB)'], ['date', 'Depart', '', 'date'], ['pax', 'Travellers', '2 adults']] },
  { id: 'umrah', label: 'Umrah', icon: 'Moon', fields: [['from', 'Departure city', 'Lahore'], ['nights', 'Nights', '14 nights'], ['date', 'Month', '', 'month'], ['pax', 'Travellers', '4 (family)']] },
  { id: 'tours', label: 'Tours', icon: 'Mountain', fields: [['to', 'Destination', 'Hunza, Skardu, Turkey…'], ['date', 'Start date', '', 'date'], ['days', 'Days', '6 days'], ['pax', 'Travellers', '2 adults']] },
  { id: 'visa', label: 'Visa', icon: 'Stamp', fields: [['to', 'Country', 'UAE, Saudi, UK…'], ['type', 'Visa type', 'Tourist / visit'], ['date', 'Travel date', '', 'date'], ['pax', 'Applicants', '1']] },
  { id: 'car', label: 'Car', icon: 'Car', fields: [['from', 'Pickup', 'Islamabad airport'], ['to', 'Drop-off', 'Naran'], ['date', 'Date', '', 'date'], ['pax', 'Vehicle', 'SUV / Coaster']] },
]

export default function BookingWidget() {
  const [tab, setTab] = useState('flights')
  const nav = useNavigate()
  const t = TABS.find((x) => x.id === tab)
  const submit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    nav(`/quote?${new URLSearchParams({ service: tab, ...data })}`)
  }
  return (
    <section className="booking container" aria-labelledby="booking-title">
      <div className="booking__card glass" data-reveal>
        <div className="booking__head">
          <h2 id="booking-title" className="booking__title">Plan your trip <em>in seconds</em></h2>
          <div className="booking__tabs" role="tablist" aria-label="Trip type">
            {TABS.map((x) => (
              <button key={x.id} role="tab" type="button" aria-selected={tab === x.id} aria-controls="booking-panel"
                className={`booking__tab ${tab === x.id ? 'is-active' : ''}`} onClick={() => setTab(x.id)}>
                <Icon name={x.icon} size={16} />{x.label}
              </button>
            ))}
          </div>
        </div>
        <form id="booking-panel" role="tabpanel" className="booking__form" onSubmit={submit} key={tab}>
          {t.fields.map(([name, label, ph, type], i) => (
            <label className="field field--float" key={name} style={{ '--i': i }}>
              <span className="field__label">{label}</span>
              <input name={name} type={type || 'text'} placeholder={ph || ' '} autoComplete="off" />
            </label>
          ))}
          <button className="btn btn--primary booking__go" type="submit"><Icon name="Search" size={18} />Get prices</button>
        </form>
        <p className="booking__note"><Icon name="Check" size={14} />Free quote in 30 minutes · No booking fee · Pay in PKR</p>
      </div>
    </section>
  )
}
