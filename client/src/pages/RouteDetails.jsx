// frontend/src/pages/RouteDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { commuteAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';
import {
  Plane, Train, Bus, Car, MapPin, ArrowLeft, ExternalLink,
  Loader2, AlertCircle, Clock, ArrowRight, Tag, Ticket,
  ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────── */
const modeColor = (mode) => {
  switch (mode?.toLowerCase()) {
    case 'flight':   return { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' };
    case 'train':    return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' };
    case 'bus':      return { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' };
    case 'taxi':
    case 'rideshare':return { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' };
    default:         return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };
  }
};

const ModeIcon = ({ mode, size = 18 }) => {
  const props = { size, strokeWidth: 1.8 };
  switch (mode?.toLowerCase()) {
    case 'flight':    return <Plane {...props} />;
    case 'train':     return <Train {...props} />;
    case 'bus':       return <Bus {...props} />;
    case 'taxi':
    case 'rideshare': return <Car {...props} />;
    default:          return <MapPin {...props} />;
  }
};

const formatPrice = (price, currency) => {
  if (!price) return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency || '₹'} ${price.toLocaleString()}`;
  }
};

/* ─────────────────────────────────────────────
   Flight Card
───────────────────────────────────────────── */
const FlightCard = ({ option, index, currency, isSelected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = modeColor(option.mode);
  const isFirst = index === 0;

  return (
    <div
      onClick={() => onSelect(option)}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)'
          : '#FFFFFF',
        border: isSelected
          ? '2px solid #6366F1'
          : `1.5px solid ${isFirst && !isSelected ? '#C7D2FE' : '#F1F5F9'}`,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isSelected
          ? '0 8px 32px rgba(99,102,241,0.3)'
          : isFirst
          ? '0 4px 20px rgba(99,102,241,0.12)'
          : '0 1px 6px rgba(0,0,0,0.06)',
        marginBottom: 12,
        position: 'relative',
      }}
    >
      {/* Cheapest badge */}
      {isFirst && (
        <div style={{
          position: 'absolute', top: 0, right: 24,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '3px 12px', borderRadius: '0 0 8px 8px',
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          Best Price
        </div>
      )}

      <div style={{ padding: '20px 24px' }}>
        {/* Top row: airline + mode tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: isSelected ? 'rgba(255,255,255,0.15)' : colors.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isSelected ? '#fff' : colors.text,
            }}>
              <ModeIcon mode={option.mode} size={20} />
            </div>
            <div>
              <div style={{
                fontWeight: 700, fontSize: 16,
                color: isSelected ? '#fff' : '#0F172A',
                letterSpacing: '-0.01em',
              }}>
                {option.name || option.airline || option.provider || 'Unknown'}
              </div>
              {option.codes && (
                <div style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.6)' : '#94A3B8', marginTop: 1 }}>
                  {option.codes}
                </div>
              )}
            </div>
          </div>
          <div style={{
            background: isSelected ? 'rgba(255,255,255,0.12)' : colors.bg,
            color: isSelected ? '#fff' : colors.text,
            border: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : colors.border}`,
            borderRadius: 20, padding: '3px 10px',
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {option.mode || 'flight'}
          </div>
        </div>

        {/* Flight route timeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
          {/* Origin */}
          <div style={{ textAlign: 'center', minWidth: 64 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: isSelected ? '#fff' : '#0F172A', fontVariant: 'tabular-nums' }}>
              {option.time || option.depart || '—'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.7)' : '#64748B', marginTop: 2 }}>
              {option.from || '—'}
            </div>
          </div>

          {/* Timeline bar */}
          <div style={{ flex: 1, padding: '0 12px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.5)' : '#CBD5E1', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              direct
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
              <div style={{ flex: 1, height: 1.5, background: isSelected ? 'rgba(255,255,255,0.25)' : '#E2E8F0' }} />
              <Plane size={14} style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : '#94A3B8', transform: 'rotate(0deg)' }} />
              <div style={{ flex: 1, height: 1.5, background: isSelected ? 'rgba(255,255,255,0.25)' : '#E2E8F0' }} />
            </div>
          </div>

          {/* Destination */}
          <div style={{ textAlign: 'center', minWidth: 64 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: isSelected ? '#fff' : '#0F172A', fontVariant: 'tabular-nums' }}>
              {option.arrivalTime || option.arrive || '—'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.7)' : '#64748B', marginTop: 2 }}>
              {option.to || '—'}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginLeft: 'auto', paddingLeft: 20, textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: isSelected ? '#A5F3FC' : '#4F46E5', letterSpacing: '-0.03em' }}>
              {formatPrice(option.price, currency)}
            </div>
            <div style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.5)' : '#94A3B8', marginTop: 1 }}>
              per person
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
              color: isSelected ? 'rgba(255,255,255,0.6)' : '#64748B',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Less info' : 'More info'}
          </button>

          <a
            href={option.url || option.bookingUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13,
              textDecoration: 'none', transition: 'all 0.15s',
              background: isSelected ? 'rgba(255,255,255,0.18)' : '#4F46E5',
              color: '#fff',
              border: isSelected ? '1px solid rgba(255,255,255,0.3)' : 'none',
            }}
          >
            Book Now <ExternalLink size={12} />
          </a>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div style={{
            marginTop: 16, paddingTop: 16,
            borderTop: `1px solid ${isSelected ? 'rgba(255,255,255,0.12)' : '#F1F5F9'}`,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12,
          }}>
            {[
              { label: 'Airline', value: option.name || option.airline || option.provider },
              { label: 'Flight', value: option.codes },
              { label: 'Departs', value: option.time || option.depart },
              { label: 'Arrives', value: option.arrivalTime || option.arrive },
              { label: 'From', value: option.from },
              { label: 'To', value: option.to },
            ].filter(f => f.value).map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: isSelected ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginBottom: 3 }}>
                  {label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#fff' : '#1E293B' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const RouteDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId: urlRouteId } = useParams();
  const { toast } = useToast();

  const routeId      = urlRouteId || location.state?.routeId;
  const from         = location.state?.from;
  const to           = location.state?.to;
  const date         = location.state?.date;
  const tinyFishData = location.state?.tinyFishData;   // { flights, notes, ... }

  const [loading, setLoading]                     = useState(false);
  const [options, setOptions]                     = useState([]);
  const [currency, setCurrency]                   = useState(location.state?.currency || 'INR');
  const [selectedOption, setSelectedOption]       = useState(null);
  const [activeTab, setActiveTab]                 = useState('all');
  const [booking, setBooking]                     = useState(false);
  const [bookingProgress, setBookingProgress]     = useState('');
  const [paymentUrl, setPaymentUrl]               = useState(null);
  const passengers                                = location.state?.passengers || [];

  /* ── Load data ── */
  useEffect(() => {
    if (!routeId && !tinyFishData) {
      navigate('/plan');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        let loaded = [];

        // 1. Use data passed from PlanCommute (tinyFishData.flights)
        if (tinyFishData?.flights?.length > 0) {
          loaded = tinyFishData.flights;
          // Try to detect currency from searchMetadata
          if (tinyFishData.searchMetadata?.currency) {
            setCurrency(tinyFishData.searchMetadata.currency);
          }
        }
        // 2. Or tinyFishData has transportationOptions (old shape)
        else if (tinyFishData?.transportationOptions?.length > 0) {
          loaded = tinyFishData.transportationOptions;
        }
        // 3. Fallback: fetch from backend
        else if (routeId) {
          const res = await commuteAPI.getTinyFishOptions(routeId);
          const data = res.data;
          loaded = data.transportationOptions?.length > 0
            ? data.transportationOptions
            : data.flightOptions || [];
        }

        if (loaded.length === 0) {
          toast({ title: 'No options found', description: 'Try planning again.', variant: 'default' });
        }

        setOptions(loaded);
      } catch (err) {
        toast({ title: 'Error', description: err.message || 'Failed to load options', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [routeId]);

  /* ── Book selected flight ── */
  const handleBook = async (option) => {
    if (!option) return;
    setBooking(true);
    setBookingProgress('Connecting to AI agent...');
    setPaymentUrl(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/commute/flights/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          flight: option,
          passengers,
          currency,
          routeId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Booking failed');
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

          if (event.type === 'PROGRESS' || event.type === 'BOOKING_STARTED') {
            setBookingProgress(event.purpose || event.message || 'Processing...');
          } else if (event.type === 'COMPLETE') {
            reader.cancel();
            if (event.paymentUrl) {
              setPaymentUrl(event.paymentUrl);
              toast({ title: 'Ready to pay!', description: 'Your details have been filled. Click to complete payment.' });
            } else {
              toast({ title: 'Booking prepared', description: 'Redirecting to booking page...', variant: 'default' });
              if (option.url || option.bookingUrl) window.open(option.url || option.bookingUrl, '_blank');
            }
            return;
          } else if (event.type === 'ERROR') {
            throw new Error(event.details || event.error || 'Booking failed');
          }
        }
      }
    } catch (error) {
      toast({ title: 'Booking failed', description: error.message, variant: 'destructive' });
    } finally {
      setBooking(false);
      setBookingProgress('');
    }
  };

  /* ── Filter ── */
  const modes = ['all', ...new Set(options.map(o => o.mode).filter(Boolean))];
  const filtered = activeTab === 'all' ? options : options.filter(o => o.mode === activeTab);

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
        }}>
          <Loader2 size={28} style={{ color: '#fff', animation: 'spin 1s linear infinite' }} />
        </div>
        <p style={{ color: '#64748B', fontWeight: 500 }}>Loading your options…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; transition: all 0.15s; }
        .tab-btn.active { background: #4F46E5; color: #fff; box-shadow: 0 2px 12px rgba(79,70,229,0.3); }
        .tab-btn.inactive { color: #64748B; }
        .tab-btn.inactive:hover { background: #F1F5F9; color: #1E293B; }
        .book-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .card-appear { animation: fadeUp 0.3s ease both; }
      `}</style>

      {/* ── Back button + route header ── */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate('/plan')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontWeight: 600, fontSize: 13, padding: 0, marginBottom: 20 }}
        >
          <ArrowLeft size={16} /> Back to Search
        </button>

        {/* Route pill */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          borderRadius: 20, padding: '24px 32px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          boxShadow: '0 8px 32px rgba(30,27,75,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{from || '—'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Origin</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.3)' }} />
                <Plane size={18} style={{ color: '#A5B4FC' }} />
                <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.3)' }} />
              </div>
              {date && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{to || '—'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Destination</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#A5F3FC' }}>{options.length}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Options</div>
            </div>
            {options.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#86EFAC' }}>
                  {formatPrice(Math.min(...options.map(o => o.price || Infinity)), currency)}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>From</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Notes banner ── */}
      {tinyFishData?.notes && (
        <div style={{
          background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12,
          padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <Tag size={15} style={{ color: '#D97706', marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
            <strong>Deals & Notes: </strong>{tinyFishData.notes}
          </div>
        </div>
      )}

      {/* ── Mode tabs ── */}
      {modes.length > 2 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {modes.map(mode => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              className={`tab-btn ${activeTab === mode ? 'active' : 'inactive'}`}
            >
              {mode === 'all' ? `All (${options.length})` : `${mode.charAt(0).toUpperCase() + mode.slice(1)} (${options.filter(o => o.mode === mode).length})`}
            </button>
          ))}
        </div>
      )}

      {/* ── Sort indicator ── */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, color: '#64748B', fontSize: 13 }}>
          <RefreshCw size={13} />
          <span>Sorted by price · {filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#F8FAFC', border: '1.5px dashed #E2E8F0', borderRadius: 16,
          padding: '60px 24px', textAlign: 'center',
        }}>
          <AlertCircle size={40} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
          <p style={{ color: '#94A3B8', fontWeight: 500 }}>No options found for this route.</p>
          <button
            onClick={() => navigate('/plan')}
            style={{ marginTop: 16, padding: '10px 24px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      ) : (
        filtered.map((option, i) => (
          <div key={i} className="card-appear" style={{ animationDelay: `${i * 0.05}s` }}>
            <FlightCard
              option={option}
              index={i}
              currency={currency}
              isSelected={selectedOption === option}
              onSelect={setSelectedOption}
            />
          </div>
        ))
      )}

      {/* ── Selected summary sticky footer ── */}
      {selectedOption && (
        <>
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: '#fff', borderTop: '1.5px solid #E2E8F0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.1)',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5',
            }}>
              <ModeIcon mode={selectedOption.mode} size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>
                {selectedOption.name || selectedOption.airline || selectedOption.provider}
                {selectedOption.codes && <span style={{ color: '#94A3B8', fontWeight: 400, marginLeft: 8, fontSize: 13 }}>{selectedOption.codes}</span>}
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 1 }}>
                {selectedOption.from} → {selectedOption.to}
                {selectedOption.time && ` · ${selectedOption.time}`}
                {selectedOption.arrivalTime && ` – ${selectedOption.arrivalTime}`}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#4F46E5', letterSpacing: '-0.02em' }}>
                {formatPrice(selectedOption.price, currency)}
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>per person</div>
            </div>
            <button
              type="button"
              onClick={() => paymentUrl ? window.open(paymentUrl, '_blank') : handleBook(selectedOption)}
              disabled={booking}
              className="book-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                border: 'none', color: '#fff',
                background: paymentUrl
                  ? 'linear-gradient(135deg, #16A34A, #15803D)'
                  : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                boxShadow: paymentUrl
                  ? '0 4px 16px rgba(22,163,74,0.35)'
                  : '0 4px 16px rgba(79,70,229,0.35)',
                transition: 'all 0.15s',
                opacity: booking ? 0.75 : 1,
                cursor: booking ? 'not-allowed' : 'pointer',
              }}
            >
              {booking
                ? <><Loader2 size={15} style={{animation:'spin 1s linear infinite'}}/>&nbsp;{bookingProgress || 'AI is filling your details...'}</>
                : paymentUrl
                ? <><ExternalLink size={15}/>&nbsp;Complete Payment</>
                : <><Ticket size={15}/>&nbsp;Auto-Book with AI</>
              }
            </button>
          </div>
        </div>

        {paymentUrl && (
          <div style={{
            position: 'fixed', bottom: 96, left: 0, right: 0, zIndex: 60,
            background: '#F0FDF4', borderTop: '1.5px solid #86EFAC',
            padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
              ✅ Passenger details filled! Your payment page is ready.
            </span>
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 20px', background: '#16A34A', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              Go to Payment →
            </a>
          </div>
        )}
        </>
      )}

      {/* Bottom padding so sticky footer doesn't overlap last card */}
      {selectedOption && <div style={{ height: 96 }} />}
    </div>
  );
};

export default RouteDetails;