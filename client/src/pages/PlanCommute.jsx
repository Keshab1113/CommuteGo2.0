// frontend/src/pages/PlanCommute.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import {
  Navigation, Loader2, MapPin, TrendingUp, DollarSign,
  Clock, Leaf, Plane, UserPlus, Trash2, User, Mail,
  Calendar, CreditCard, ChevronDown, ChevronUp
} from 'lucide-react';

/* ── Passenger template ───────────────────── */
const emptyPassenger = () => ({
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', passportNumber: '', nationality: '',
  passportExpiry: '', gender: 'male',
});

/* ── Tiny field component ─────────────────── */
const Field = ({ label, name, type = 'text', value, onChange, required, placeholder, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
    </label>
    {options ? (
      <select
        name={name} value={value} onChange={onChange} required={required}
        style={inputStyle}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        style={inputStyle}
      />
    )}
  </div>
);

const inputStyle = {
  height: 40, padding: '0 12px', borderRadius: 8,
  border: '1.5px solid #E2E8F0', fontSize: 14, color: '#1E293B',
  background: '#fff', outline: 'none', width: '100%',
  fontFamily: 'inherit',
};

/* ── Main component ──────────────────────── */
const PlanCommute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading]               = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [selectedPreference, setSelectedPreference] = useState('cheapest');
  const [passengersOpen, setPassengersOpen] = useState(false);

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    travelTime: '08:00',
    currency: 'INR',
    transportMode: 'flight',   // always flight
  });

  const [passengers, setPassengers] = useState([emptyPassenger()]);

  /* ── Form handlers ── */
  const handleInput = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const updatePassenger = (idx, e) => {
    setPassengers(p => p.map((ps, i) =>
      i === idx ? { ...ps, [e.target.name]: e.target.value } : ps
    ));
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers(p => [...p, emptyPassenger()]);
  };

  const removePassenger = (idx) => {
    if (passengers.length === 1) return;
    setPassengers(p => p.filter((_, i) => i !== idx));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgressMessage('Connecting to AI agent...');

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    const travelDateTime = `${formData.travelDate}T${formData.travelTime}`;

    try {
      const response = await fetch(`${API_BASE_URL}/commute/agent/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          travelDate: travelDateTime,
          transportMode: 'flight',
          preferences: { modePreference: selectedPreference },
          passengers,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to plan commute');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let event;
          try { event = JSON.parse(raw); } catch (_) { continue; }

          if (event.type === 'STARTED')        setProgressMessage('AI agent started browsing...');
          else if (event.type === 'ROUTE_CREATED') {}
          else if (event.type === 'PROGRESS')  setProgressMessage(event.purpose);
          else if (event.type === 'COMPLETE') {
            reader.cancel();
            const { routeId, tinyFishData } = event;
            toast({ title: 'Routes found!', description: 'Showing the best flight options.' });
            navigate(`/route-details/${routeId}`, {
              state: {
                routeId,
                from: formData.source,
                to: formData.destination,
                date: formData.travelDate,
                currency: formData.currency,
                preference: selectedPreference,
                tinyFishData,
                passengers,
              },
            });
            return;
          } else if (event.type === 'ERROR') {
            throw new Error(event.details || event.error || 'Agent failed');
          }
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed', variant: 'destructive' });
    } finally {
      setLoading(false);
      setProgressMessage('');
    }
  };

  const preferenceOptions = [
    { value: 'cheapest', label: 'Cheapest', icon: DollarSign },
    { value: 'fastest',  label: 'Fastest',  icon: Clock },
    { value: 'balanced', label: 'Balanced', icon: TrendingUp },
    { value: 'greenest', label: 'Greenest', icon: Leaf },
  ];

  const currencyOptions = [
    { value: 'INR', label: 'INR — ₹ Indian Rupee' },
    { value: 'USD', label: 'USD — $ US Dollar' },
    { value: 'EUR', label: 'EUR — € Euro' },
    { value: 'GBP', label: 'GBP — £ British Pound' },
    { value: 'AUD', label: 'AUD — A$ Australian Dollar' },
    { value: 'CAD', label: 'CAD — C$ Canadian Dollar' },
    { value: 'JPY', label: 'JPY — ¥ Japanese Yen' },
    { value: 'CNY', label: 'CNY — ¥ Chinese Yuan' },
  ];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .pref-tab { border: 1.5px solid #E2E8F0; background: #fff; border-radius: 10px; padding: 10px 14px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #64748B; flex: 1; justify-content: center; }
        .pref-tab.active { background: #4F46E5; color: #fff; border-color: #4F46E5; box-shadow: 0 2px 12px rgba(79,70,229,0.25); }
        .pref-tab:not(.active):hover { border-color: #C7D2FE; color: #4F46E5; }
        .submit-btn { width: 100%; height: 52px; border-radius: 12px; border: none; cursor: pointer; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #4F46E5, #7C3AED); box-shadow: 0 4px 16px rgba(79,70,229,0.3); transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .submit-btn:disabled { opacity: 0.75; cursor: not-allowed; }
        .submit-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,70,229,0.4); }
        .passenger-card { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 20px; margin-bottom: 12px; }
        .section-title { font-size: 15px; font-weight: 700; color: #1E293B; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        @media (max-width: 600px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
      `}</style>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plane size={18} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Find Flights</h1>
        </div>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>AI-powered search · Real prices · Direct booking</p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── Card 1: Route ── */}
        <div style={cardStyle}>
          <div className="section-title"><MapPin size={16} style={{ color: '#6366F1' }} /> Route Details</div>

          <div className="grid-2" style={{ marginBottom: 14 }}>
            <Field label="From" name="source" value={formData.source} onChange={handleInput} required placeholder="City or airport" />
            <Field label="To" name="destination" value={formData.destination} onChange={handleInput} required placeholder="City or airport" />
          </div>

          <div className="grid-3" style={{ marginBottom: 14 }}>
            <Field label="Date" name="travelDate" type="date" value={formData.travelDate} onChange={handleInput} required />
            <Field label="Preferred Time" name="travelTime" type="time" value={formData.travelTime} onChange={handleInput} required />
            <Field label="Currency" name="currency" value={formData.currency} onChange={handleInput}
              options={currencyOptions} />
          </div>

          {/* Preference tabs */}
          <div style={{ marginTop: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              Search Preference
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {preferenceOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value} type="button"
                  className={`pref-tab ${selectedPreference === value ? 'active' : ''}`}
                  onClick={() => setSelectedPreference(value)}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Card 2: Passengers ── */}
        <div style={cardStyle}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: passengersOpen ? 16 : 0 }}>
            <button
              type="button"
              onClick={() => setPassengersOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}
            >
              <div className="section-title" style={{ margin: 0 }}>
                <User size={16} style={{ color: '#6366F1' }} />
                Passengers
                <span style={{ background: '#EEF2FF', color: '#4F46E5', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                  {passengers.length}
                </span>
              </div>
              {passengersOpen ? <ChevronUp size={16} style={{ color: '#94A3B8' }} /> : <ChevronDown size={16} style={{ color: '#94A3B8' }} />}
            </button>

            {passengersOpen && passengers.length < 6 && (
              <button
                type="button" onClick={addPassenger}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: '#EEF2FF', color: '#4F46E5', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                <UserPlus size={14} /> Add Passenger
              </button>
            )}
          </div>

          {/* Collapsed summary */}
          {!passengersOpen && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {passengers.map((p, i) => (
                <div key={i} style={{ background: '#EEF2FF', color: '#4F46E5', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500 }}>
                  {p.firstName || p.lastName
                    ? `${p.firstName} ${p.lastName}`.trim()
                    : `Passenger ${i + 1}`}
                </div>
              ))}
              <div style={{ color: '#94A3B8', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                (click to expand)
              </div>
            </div>
          )}

          {/* Expanded passengers */}
          {passengersOpen && passengers.map((passenger, idx) => (
            <div key={idx} className="passenger-card">
              {/* Passenger header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>
                    {passenger.firstName || passenger.lastName
                      ? `${passenger.firstName} ${passenger.lastName}`.trim()
                      : `Passenger ${idx + 1}`}
                  </span>
                  {idx === 0 && (
                    <span style={{ background: '#DCFCE7', color: '#16A34A', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                      Lead
                    </span>
                  )}
                </div>
                {idx > 0 && (
                  <button type="button" onClick={() => removePassenger(idx)}
                    style={{ background: '#FFF1F2', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '5px 8px', color: '#E11D48', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Personal info */}
              <div className="grid-2" style={{ marginBottom: 12 }}>
                <Field label="First Name" name="firstName" value={passenger.firstName}
                  onChange={e => updatePassenger(idx, e)} required={idx === 0} placeholder="As on passport" />
                <Field label="Last Name" name="lastName" value={passenger.lastName}
                  onChange={e => updatePassenger(idx, e)} required={idx === 0} placeholder="As on passport" />
              </div>
              <div className="grid-2" style={{ marginBottom: 12 }}>
                <Field label="Email" name="email" type="email" value={passenger.email}
                  onChange={e => updatePassenger(idx, e)} required={idx === 0} placeholder="email@example.com" />
                <Field label="Phone" name="phone" type="tel" value={passenger.phone}
                  onChange={e => updatePassenger(idx, e)} required={idx === 0} placeholder="+91 98765 43210" />
              </div>

              {/* Travel docs */}
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px', marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Travel Document
                </div>
                <div className="grid-3" style={{ marginBottom: 12 }}>
                  <Field label="Passport No." name="passportNumber" value={passenger.passportNumber}
                    onChange={e => updatePassenger(idx, e)} required={idx === 0} placeholder="A1234567" />
                  <Field label="Nationality" name="nationality" value={passenger.nationality}
                    onChange={e => updatePassenger(idx, e)} required={idx === 0} placeholder="Indian" />
                  <Field label="Passport Expiry" name="passportExpiry" type="date" value={passenger.passportExpiry}
                    onChange={e => updatePassenger(idx, e)} required={idx === 0} />
                </div>
                <div className="grid-2">
                  <Field label="Date of Birth" name="dateOfBirth" type="date" value={passenger.dateOfBirth}
                    onChange={e => updatePassenger(idx, e)} required={idx === 0} />
                  <Field label="Gender" name="gender" value={passenger.gender}
                    onChange={e => updatePassenger(idx, e)}
                    options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Submit ── */}
        {loading && progressMessage && (
          <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 12, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Loader2 size={15} style={{ color: '#4F46E5', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#3730A3', fontWeight: 500 }}>{progressMessage}</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Searching flights...</>
          ) : (
            <><Plane size={18} /> Search Flights</>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 12 }}>
          AI agent searches multiple sites · Takes 2–4 minutes · Real-time prices
        </p>
      </form>
    </div>
  );
};

const cardStyle = {
  background: '#fff',
  border: '1.5px solid #E2E8F0',
  borderRadius: 16,
  padding: '24px',
  marginBottom: 16,
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
};

export default PlanCommute;