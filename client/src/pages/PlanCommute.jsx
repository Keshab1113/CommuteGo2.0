// frontend/src/pages/PlanCommute.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import {
  Loader2,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  Leaf,
  Plane,
  UserPlus,
  Trash2,
  User,
  ChevronDown,
  ChevronUp,
  Luggage,
  Utensils,
  Armchair,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────── */
const emptyPassenger = () => ({
  type: "adult", // adult | child | infant
  title: "Mr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "male",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  passportIssuingCountry: "",
  frequentFlyerNumber: "",
  mealPreference: "none",
  specialAssistance: "",
});

const inputStyle = {
  height: 40,
  padding: "0 12px",
  borderRadius: 8,
  border: "1.5px solid #E2E8F0",
  fontSize: 14,
  color: "#1E293B",
  background: "#fff",
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
};

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  options,
  hint,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#64748B",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
      }}
    >
      {label}
      {required && <span style={{ color: "#EF4444" }}> *</span>}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={inputStyle}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={inputStyle}
      />
    )}
    {hint && <span style={{ fontSize: 11, color: "#94A3B8" }}>{hint}</span>}
  </div>
);

const cardStyle = {
  background: "#fff",
  border: "1.5px solid #E2E8F0",
  borderRadius: 16,
  padding: "22px 24px",
  marginBottom: 14,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const SectionTitle = ({ icon: Icon, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 18,
      fontWeight: 700,
      fontSize: 15,
      color: "#1E293B",
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: "#EEF2FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#4F46E5",
      }}
    >
      <Icon size={15} />
    </div>
    {children}
  </div>
);

/* ─── main ────────────────────────────────────────── */
const PlanCommute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);
  const [selectedPref, setSelectedPref] = useState("cheapest");
  const [passOpen, setPassOpen] = useState(false);
  const [passengers, setPassengers] = useState([emptyPassenger()]);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    travelDate: new Date().toISOString().split("T")[0],
    travelTime: "08:00",
    currency: "INR",
    transportMode: "flight",
    cabinClass: "economy", // economy | premium_economy | business | first
    baggageAllowance: "1", // checked bags
    seatPreference: "no_preference", // window | aisle | middle | no_preference
    mealPreference: "none", // none | vegetarian | vegan | halal | kosher | gluten_free
    specialRequests: "",
  });

  const handleInput = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const updatePassenger = (idx, e) =>
    setPassengers((p) =>
      p.map((ps, i) =>
        i === idx ? { ...ps, [e.target.name]: e.target.value } : ps,
      ),
    );

  const addPassenger = () =>
    passengers.length < 9 && setPassengers((p) => [...p, emptyPassenger()]);
  const removePassenger = (idx) =>
    passengers.length > 1 &&
    setPassengers((p) => p.filter((_, i) => i !== idx));

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate lead passenger minimum fields
    const lead = passengers[0];
    if (
      !lead.firstName ||
      !lead.lastName ||
      !lead.email ||
      !lead.phone ||
      !lead.passportNumber ||
      !lead.dateOfBirth ||
      !lead.nationality ||
      !lead.passportExpiry
    ) {
      toast({
        title: "Passenger details required",
        description: "Please fill all required fields for the lead passenger.",
        variant: "destructive",
      });
      setPassOpen(true);
      return;
    }

    setLoading(true);
    setProgressMsg("Connecting to AI agent...");

    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/commute/agent/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          travelDate: `${formData.travelDate}T${formData.travelTime}`,
          transportMode: "flight",
          preferences: { modePreference: selectedPref },
          passengers,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          let ev;
          try {
            ev = JSON.parse(raw);
          } catch (_) {
            continue;
          }

          if (ev.type === "STARTED")
            setProgressMsg("AI agent started browsing...");
          else if (ev.type === "PROGRESS") setProgressMsg(ev.purpose);
          else if (ev.type === "COMPLETE") {
            reader.cancel();
            if (ev.paymentUrl) {
              // Payment URL ready — show it directly, no need to navigate
              setPaymentResult({
                paymentUrl: ev.paymentUrl,
                bookingReference: ev.bookingReference,
                totalAmount: ev.totalAmount,
                flight: ev.tinyFishData?.flights?.[0] || null,
              });
              toast({
                title: "✅ Booking ready!",
                description: "Click the link to complete payment on IndiGo.",
              });
            } else {
              // Fallback: no payment URL yet, show flight results page
              navigate(`/route-details/${ev.routeId}`, {
                state: {
                  routeId: ev.routeId,
                  from: formData.source,
                  to: formData.destination,
                  date: formData.travelDate,
                  currency: formData.currency,
                  tinyFishData: ev.tinyFishData,
                  passengers,
                  bookingPreferences: {
                    cabinClass: formData.cabinClass,
                    baggageAllowance: formData.baggageAllowance,
                    seatPreference: formData.seatPreference,
                    mealPreference: formData.mealPreference,
                    specialRequests: formData.specialRequests,
                  },
                },
              });
            }
            return;
          } else if (ev.type === "ERROR") {
            throw new Error(ev.details || ev.error || "Agent failed");
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  const preferenceOptions = [
    { value: "cheapest", label: "Cheapest", icon: DollarSign },
    { value: "fastest", label: "Fastest", icon: Clock },
    { value: "balanced", label: "Balanced", icon: TrendingUp },
    { value: "greenest", label: "Greenest", icon: Leaf },
  ];

  const cabinOptions = [
    { value: "economy", label: "🪑 Economy" },
    { value: "premium_economy", label: "🛋️ Premium Economy" },
    { value: "business", label: "💺 Business Class" },
    { value: "first", label: "👑 First Class" },
  ];

  const seatOptions = [
    { value: "no_preference", label: "No Preference" },
    { value: "window", label: "🪟 Window" },
    { value: "aisle", label: "🚶 Aisle" },
    { value: "middle", label: "⬜ Middle" },
    { value: "extra_legroom", label: "↕️ Extra Legroom" },
  ];

  const mealOptions = [
    { value: "none", label: "Standard Meal" },
    { value: "vegetarian", label: "🥗 Vegetarian" },
    { value: "vegan", label: "🌱 Vegan" },
    { value: "halal", label: "🌙 Halal" },
    { value: "kosher", label: "✡️ Kosher" },
    { value: "gluten_free", label: "🚫🌾 Gluten Free" },
    { value: "diabetic", label: "💉 Diabetic" },
    { value: "low_sodium", label: "🧂 Low Sodium" },
  ];

  const currencyOptions = [
    { value: "INR", label: "INR — ₹ Indian Rupee" },
    { value: "USD", label: "USD — $ US Dollar" },
    { value: "EUR", label: "EUR — € Euro" },
    { value: "GBP", label: "GBP — £ British Pound" },
    { value: "AUD", label: "AUD — A$ Australian Dollar" },
    { value: "CAD", label: "CAD — C$ Canadian Dollar" },
    { value: "JPY", label: "JPY — ¥ Japanese Yen" },
  ];

  const passengerTypeOptions = [
    { value: "adult", label: "Adult (12+)" },
    { value: "child", label: "Child (2–11)" },
    { value: "infant", label: "Infant (0–2)" },
  ];

  const titleOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Mrs", label: "Mrs" },
    { value: "Ms", label: "Ms" },
    { value: "Dr", label: "Dr" },
    { value: "Prof", label: "Prof" },
  ];

  return (
    <div
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "28px 18px",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input, select { transition: border-color 0.15s, box-shadow 0.15s; }
        input:focus, select:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.13) !important; outline: none; }
        .pref-btn { flex: 1; border: 1.5px solid #E2E8F0; background: #fff; border-radius: 10px; padding: 9px 8px; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748B; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; font-family: inherit; }
        .pref-btn.active { background: #4F46E5; color: #fff; border-color: #4F46E5; box-shadow: 0 2px 10px rgba(79,70,229,0.22); }
        .pref-btn:not(.active):hover { border-color: #C7D2FE; color: #4F46E5; }
        .submit-btn { width: 100%; height: 52px; border-radius: 12px; border: none; cursor: pointer; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #4F46E5, #7C3AED); box-shadow: 0 4px 16px rgba(79,70,229,0.28); transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 9px; font-family: inherit; }
        .submit-btn:disabled { opacity: 0.72; cursor: not-allowed; }
        .submit-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,70,229,0.38); }
        .pax-card { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; }
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .g4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
        @media(max-width:600px) { .g2,.g3,.g4 { grid-template-columns: 1fr; } }
        .progress-bar { background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 10px; padding: 11px 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
        @keyframes spin { to { transform: rotate(360deg) } }
        .spin { animation: spin 1s linear infinite; }
        .divider-label { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; background: #F8FAFC; padding: 0 10px; }
        .divider { display: flex; align-items: center; gap: 0; margin: 14px 0 16px; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:#E2E8F0; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 5,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plane size={18} color="#fff" />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 25,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            Book a Flight
          </h1>
        </div>
        <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
          AI fills your details automatically · You only pay
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Card 1: Route ── */}
        <div style={cardStyle}>
          <SectionTitle icon={MapPin}>Route & Schedule</SectionTitle>

          <div className="g2" style={{ marginBottom: 12 }}>
            <Field
              label="From"
              name="source"
              value={formData.source}
              onChange={handleInput}
              required
              placeholder="City or airport (e.g. Kolkata)"
            />
            <Field
              label="To"
              name="destination"
              value={formData.destination}
              onChange={handleInput}
              required
              placeholder="City or airport (e.g. London)"
            />
          </div>
          <div className="g3" style={{ marginBottom: 12 }}>
            <Field
              label="Date"
              name="travelDate"
              type="date"
              value={formData.travelDate}
              onChange={handleInput}
              required
            />
            <Field
              label="Preferred Time"
              name="travelTime"
              type="time"
              value={formData.travelTime}
              onChange={handleInput}
            />
            <Field
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleInput}
              options={currencyOptions}
            />
          </div>

          {/* Preference */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 8,
              }}
            >
              Search Preference
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {preferenceOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={`pref-btn ${selectedPref === value ? "active" : ""}`}
                  onClick={() => setSelectedPref(value)}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Card 2: Booking Preferences ── */}
        <div style={cardStyle}>
          <SectionTitle icon={Armchair}>Flight Preferences</SectionTitle>
          <div className="g2" style={{ marginBottom: 12 }}>
            <Field
              label="Cabin Class"
              name="cabinClass"
              value={formData.cabinClass}
              onChange={handleInput}
              options={cabinOptions}
            />
            <Field
              label="Checked Baggage (bags)"
              name="baggageAllowance"
              value={formData.baggageAllowance}
              onChange={handleInput}
              options={[
                { value: "0", label: "0 bags — carry-on only" },
                { value: "1", label: "1 bag (23 kg)" },
                { value: "2", label: "2 bags (23 kg each)" },
                { value: "3", label: "3 bags" },
              ]}
            />
          </div>
          <div className="g2" style={{ marginBottom: 12 }}>
            <Field
              label="Seat Preference"
              name="seatPreference"
              value={formData.seatPreference}
              onChange={handleInput}
              options={seatOptions}
            />
            <Field
              label="Meal Preference"
              name="mealPreference"
              value={formData.mealPreference}
              onChange={handleInput}
              options={mealOptions}
            />
          </div>
          <Field
            label="Special Requests / Assistance"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInput}
            placeholder="e.g. wheelchair assistance, travelling with infant, etc."
          />
        </div>

        {/* ── Card 3: Passengers ── */}
        <div style={cardStyle}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: passOpen ? 18 : 0,
            }}
          >
            <button
              type="button"
              onClick={() => setPassOpen((o) => !o)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <SectionTitle icon={User}>
                Passengers&nbsp;
                <span
                  style={{
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    borderRadius: 20,
                    padding: "1px 10px",
                    fontSize: 12,
                  }}
                >
                  {passengers.length}
                </span>
              </SectionTitle>
              {passOpen ? (
                <ChevronUp size={16} color="#94A3B8" />
              ) : (
                <ChevronDown size={16} color="#94A3B8" />
              )}
            </button>
            {passOpen && passengers.length < 9 && (
              <button
                type="button"
                onClick={addPassenger}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 13px",
                  borderRadius: 8,
                  background: "#EEF2FF",
                  color: "#4F46E5",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                <UserPlus size={14} /> Add
              </button>
            )}
          </div>

          {/* Collapsed pills */}
          {!passOpen && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              {passengers.map((p, i) => (
                <span
                  key={i}
                  style={{
                    background: p.firstName ? "#EEF2FF" : "#FFF7ED",
                    color: p.firstName ? "#4F46E5" : "#EA580C",
                    borderRadius: 20,
                    padding: "3px 12px",
                    fontSize: 13,
                    fontWeight: 500,
                    border: `1px solid ${p.firstName ? "#C7D2FE" : "#FED7AA"}`,
                  }}
                >
                  {p.firstName
                    ? `${p.firstName} ${p.lastName}`.trim()
                    : `⚠ Passenger ${i + 1} incomplete`}
                </span>
              ))}
            </div>
          )}

          {/* Expanded */}
          {passOpen &&
            passengers.map((pax, idx) => (
              <div key={idx} className="pax-card">
                {/* Pax header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#4F46E5",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#1E293B",
                      }}
                    >
                      {pax.firstName
                        ? `${pax.firstName} ${pax.lastName}`.trim()
                        : `Passenger ${idx + 1}`}
                    </span>
                    {idx === 0 && (
                      <span
                        style={{
                          background: "#DCFCE7",
                          color: "#16A34A",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "1px 8px",
                          borderRadius: 20,
                        }}
                      >
                        Lead
                      </span>
                    )}
                  </div>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(idx)}
                      style={{
                        background: "#FFF1F2",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        padding: "5px 8px",
                        color: "#E11D48",
                        display: "flex",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Type & title */}
                <div className="g3" style={{ marginBottom: 10 }}>
                  <Field
                    label="Passenger Type"
                    name="type"
                    value={pax.type}
                    onChange={(e) => updatePassenger(idx, e)}
                    options={passengerTypeOptions}
                  />
                  <Field
                    label="Title"
                    name="title"
                    value={pax.title}
                    onChange={(e) => updatePassenger(idx, e)}
                    options={titleOptions}
                  />
                  <Field
                    label="Gender"
                    name="gender"
                    value={pax.gender}
                    onChange={(e) => updatePassenger(idx, e)}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>

                {/* Name */}
                <div className="g2" style={{ marginBottom: 10 }}>
                  <Field
                    label="First Name (as in passport)"
                    name="firstName"
                    value={pax.firstName}
                    onChange={(e) => updatePassenger(idx, e)}
                    required={idx === 0}
                    placeholder="e.g. Rahul"
                  />
                  <Field
                    label="Last Name (as in passport)"
                    name="lastName"
                    value={pax.lastName}
                    onChange={(e) => updatePassenger(idx, e)}
                    required={idx === 0}
                    placeholder="e.g. Sharma"
                  />
                </div>

                {/* Contact (lead only) */}
                {idx === 0 && (
                  <div className="g2" style={{ marginBottom: 10 }}>
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={pax.email}
                      onChange={(e) => updatePassenger(idx, e)}
                      required
                      placeholder="booking@email.com"
                    />
                    <Field
                      label="Phone (with country code)"
                      name="phone"
                      type="tel"
                      value={pax.phone}
                      onChange={(e) => updatePassenger(idx, e)}
                      required
                      placeholder="+91 98765 43210"
                    />
                  </div>
                )}

                {/* DOB */}
                <div className="g2" style={{ marginBottom: 10 }}>
                  <Field
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={pax.dateOfBirth}
                    onChange={(e) => updatePassenger(idx, e)}
                    required={idx === 0}
                  />
                  <Field
                    label="Nationality"
                    name="nationality"
                    value={pax.nationality}
                    onChange={(e) => updatePassenger(idx, e)}
                    required={idx === 0}
                    placeholder="e.g. Indian"
                  />
                </div>

                {/* Divider */}
                <div className="divider">
                  <span className="divider-label">Travel Document</span>
                </div>

                {/* Passport */}
                <div className="g3" style={{ marginBottom: 10 }}>
                  <Field
                    label="Passport Number"
                    name="passportNumber"
                    value={pax.passportNumber}
                    onChange={(e) => updatePassenger(idx, e)}
                    required={idx === 0}
                    placeholder="A1234567"
                  />
                  <Field
                    label="Passport Expiry"
                    name="passportExpiry"
                    type="date"
                    value={pax.passportExpiry}
                    onChange={(e) => updatePassenger(idx, e)}
                    required={idx === 0}
                    hint="Must be 6+ months from travel"
                  />
                  <Field
                    label="Issuing Country"
                    name="passportIssuingCountry"
                    value={pax.passportIssuingCountry}
                    onChange={(e) => updatePassenger(idx, e)}
                    placeholder="India"
                  />
                </div>

                {/* Optional extras */}
                <div className="divider">
                  <span className="divider-label">Optional</span>
                </div>
                <div className="g2">
                  <Field
                    label="Frequent Flyer No."
                    name="frequentFlyerNumber"
                    value={pax.frequentFlyerNumber}
                    onChange={(e) => updatePassenger(idx, e)}
                    placeholder="If applicable"
                  />
                  <Field
                    label="Meal Preference"
                    name="mealPreference"
                    value={pax.mealPreference}
                    onChange={(e) => updatePassenger(idx, e)}
                    options={mealOptions}
                  />
                </div>
                {idx > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <Field
                      label="Special Assistance"
                      name="specialAssistance"
                      value={pax.specialAssistance}
                      onChange={(e) => updatePassenger(idx, e)}
                      placeholder="e.g. Wheelchair, WCHR"
                    />
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Progress */}
        {loading && progressMsg && (
          <div className="progress-bar">
            <Loader2
              size={15}
              color="#4F46E5"
              className="spin"
              style={{ flexShrink: 0, animation: "spin 1s linear infinite" }}
            />
            <span style={{ fontSize: 13, color: "#3730A3", fontWeight: 500 }}>
              {progressMsg}
            </span>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader2
                size={17}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Searching flights...
            </>
          ) : (
            <>
              <Plane size={17} /> Search & Auto-Fill Booking
            </>
          )}
        </button>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#94A3B8",
            marginTop: 10,
          }}
        >
          AI searches real flights · Fills your details automatically · You only
          pay
        </p>
      </form>

      {/* Payment Result */}
      {paymentResult && (
        <div
          style={{
            marginTop: 24,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(22,163,74,0.2)",
            border: "2px solid #22C55E",
          }}
        >
          {/* Green header */}
          <div
            style={{
              background: "linear-gradient(135deg, #14532D, #166534)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>✅</div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                Your booking is ready!
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.75)",
                  marginTop: 4,
                }}
              >
                AI has filled all your details. Just complete the payment on
                IndiGo.
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: "#F0FDF4", padding: "20px 28px" }}>
            {paymentResult.flight && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 16,
                  background: "#fff",
                  borderRadius: 12,
                  padding: "14px 18px",
                  border: "1px solid #BBF7D0",
                }}
              >
                <div style={{ fontSize: 22 }}>✈️</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}
                  >
                    {/* {paymentResult.flight.name || paymentResult.flight.airline || 'IndiGo'} */}
                    IndiGo
                    {paymentResult.flight.codes && (
                      <span
                        style={{
                          color: "#64748B",
                          fontWeight: 400,
                          marginLeft: 8,
                          fontSize: 13,
                        }}
                      >
                        {paymentResult.flight.codes}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
                    {formData.source} → {formData.destination}
                    {paymentResult.flight.time &&
                      ` · Departs ${paymentResult.flight.time}`}
                    {paymentResult.flight.arrivalTime &&
                      ` · Arrives ${paymentResult.flight.arrivalTime}`}
                  </div>
                </div>
                {paymentResult.totalAmount && (
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#16A34A",
                      }}
                    >
                      {paymentResult.totalAmount}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>total</div>
                  </div>
                )}
              </div>
            )}

            {paymentResult.bookingReference && (
              <div style={{ marginBottom: 14, fontSize: 13, color: "#15803D" }}>
                <strong>Booking Reference:</strong>{" "}
                {paymentResult.bookingReference}
              </div>
            )}

            <a
              href={paymentResult.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "16px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #16A34A, #15803D)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 17,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
              }}
            >
              💳 Complete Payment on IndiGo →
            </a>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#6B7280",
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Your name, DOB, passport & contact details are already filled.
              Just enter your payment method.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCommute;
