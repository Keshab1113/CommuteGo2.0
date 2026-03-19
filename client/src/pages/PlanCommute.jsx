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
      className="text-slate-500 dark:text-slate-400"
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
      }}
    >
      {label}
      {required && <span className="text-red-500 dark:text-red-400"> *</span>}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
        style={{
          height: 40,
          padding: "0 12px",
          borderRadius: 8,
          borderWidth: "1.5px",
          borderStyle: "solid",
          fontSize: 14,
          outline: "none",
          width: "100%",
          fontFamily: "inherit",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
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
        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
        style={{
          height: 40,
          padding: "0 12px",
          borderRadius: 8,
          borderWidth: "1.5px",
          borderStyle: "solid",
          fontSize: 14,
          outline: "none",
          width: "100%",
          fontFamily: "inherit",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
    )}
    {hint && (
      <span className="text-slate-400 dark:text-slate-500" style={{ fontSize: 11 }}>
        {hint}
      </span>
    )}
  </div>
);

const SectionTitle = ({ icon: Icon, children }) => (
  <div
    className="text-slate-800 dark:text-slate-100"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 18,
      fontWeight: 700,
      fontSize: 15,
    }}
  >
    <div
      className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
      className=""
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "28px 18px",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.13) !important; outline: none; }
        .pref-btn { flex: 1; border-width: 1.5px; border-style: solid; background: #fff; border-radius: 10px; padding: 9px 8px; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748B; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; font-family: inherit; }
        .dark .pref-btn { background: #1E293B; color: #94A3B8; }
        .pref-btn.active { background: #4F46E5; color: #fff; border-color: #4F46E5; box-shadow: 0 2px 10px rgba(79,70,229,0.22); }
        .pref-btn:not(.active):hover { border-color: #C7D2FE; color: #4F46E5; }
        .dark .pref-btn:not(.active):hover { border-color: #6366F1; color: #818CF8; }
        .submit-btn { width: 100%; height: 52px; border-radius: 12px; border: none; cursor: pointer; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #4F46E5, #7C3AED); box-shadow: 0 4px 16px rgba(79,70,229,0.28); transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 9px; font-family: inherit; }
        .submit-btn:disabled { opacity: 0.72; cursor: not-allowed; }
        .submit-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,70,229,0.38); }
        .pax-card { background: #F8FAFC; border-width: 1.5px; border-style: solid; border-color: #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; }
        .dark .pax-card { background: #1E293B; border-color: #475569; }
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .g4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
        @media(max-width:600px) { .g2,.g3,.g4 { grid-template-columns: 1fr; } }
        .progress-bar { background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 10px; padding: 11px 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
        .dark .progress-bar { background: #1E293B; border-color: #475569; }
        @keyframes spin { to { transform: rotate(360deg) } }
        .spin { animation: spin 1s linear infinite; }
        .divider-label { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; background: #F8FAFC; padding: 0 10px; }
        .dark .divider-label { background: #1E293B; color: #64748B; }
        .divider { display: flex; align-items: center; gap: 0; margin: 14px 0 16px; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:#E2E8F0; }
        .dark .divider::before,.dark .divider::after { background: #475569; }
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
            className="text-slate-900 dark:text-white"
            style={{
              margin: 0,
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Book a Flight
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400" style={{ margin: 0, fontSize: 14 }}>
          AI fills your details automatically · You only pay
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Card 1: Route ── */}
        <div className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" style={{
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderRadius: 16,
          padding: "22px 24px",
          marginBottom: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
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
              className="text-slate-500 dark:text-slate-400"
              style={{
                fontSize: 11,
                fontWeight: 700,
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
                  style={{ borderColor: selectedPref === value ? "#4F46E5" : "#E2E8F0" }}
                  onClick={() => setSelectedPref(value)}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Card 2: Booking Preferences ── */}
        <div className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" style={{
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderRadius: 16,
          padding: "22px 24px",
          marginBottom: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
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
        <div className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" style={{
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderRadius: 16,
          padding: "22px 24px",
          marginBottom: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
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
                  className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
                  style={{
                    borderRadius: 20,
                    padding: "1px 10px",
                    fontSize: 12,
                  }}
                >
                  {passengers.length}
                </span>
              </SectionTitle>
              {passOpen ? (
                <ChevronUp size={16} className="text-slate-400 dark:text-slate-500" />
              ) : (
                <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
              )}
            </button>
            {passOpen && passengers.length < 9 && (
              <button
                type="button"
                onClick={addPassenger}
                className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 13px",
                  borderRadius: 8,
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
                  className={p.firstName 
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    : "bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                  }
                  style={{
                    borderRadius: 20,
                    padding: "3px 12px",
                    fontSize: 13,
                    fontWeight: 500,
                    borderWidth: "1px",
                    borderStyle: "solid",
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
                      className="text-slate-800 dark:text-slate-100"
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {pax.firstName
                        ? `${pax.firstName} ${pax.lastName}`.trim()
                        : `Passenger ${idx + 1}`}
                    </span>
                    {idx === 0 && (
                      <span
                        className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300"
                        style={{
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
                      className="bg-rose-50 dark:bg-rose-900/50 text-rose-500 dark:text-rose-300"
                      style={{
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        padding: "5px 8px",
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
              className="text-indigo-600 dark:text-indigo-400 spin"
              style={{ flexShrink: 0 }}
            />
            <span className="text-indigo-700 dark:text-indigo-300" style={{ fontSize: 13, fontWeight: 500 }}>
              {progressMsg}
            </span>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader2
                size={17}
                className="spin"
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
          className="text-slate-400 dark:text-slate-500"
          style={{
            textAlign: "center",
            fontSize: 12,
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
          className="mt-6 rounded-xl overflow-hidden border-2 border-green-500 dark:border-green-600"
        >
          {/* Green header */}
          <div
            className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700"
            style={{
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>✅</div>
            <div>
              <div
                className="text-white"
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                Your booking is ready!
              </div>
              <div
                className="text-green-50 dark:text-green-100"
                style={{
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                AI has filled all your details. Just complete the payment on
                IndiGo.
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-green-50 dark:bg-slate-800" style={{ padding: "20px 28px" }}>
            {paymentResult.flight && (
              <div
                className="bg-white dark:bg-slate-700 border-green-200 dark:border-green-800"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 16,
                  borderRadius: 12,
                  padding: "14px 18px",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              >
                <div style={{ fontSize: 22 }}>✈️</div>
                <div style={{ flex: 1 }}>
                  <div
                    className="text-slate-800 dark:text-slate-100"
                    style={{ fontWeight: 700, fontSize: 15 }}
                  >
                    IndiGo
                    {paymentResult.flight.codes && (
                      <span
                        className="text-slate-500 dark:text-slate-400"
                        style={{
                          fontWeight: 400,
                          marginLeft: 8,
                          fontSize: 13,
                        }}
                      >
                        {paymentResult.flight.codes}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: 13, marginTop: 2 }}>
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
                      className="text-green-600 dark:text-green-400"
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                      }}
                    >
                      {paymentResult.totalAmount}
                    </div>
                    <div className="text-slate-400 dark:text-slate-500" style={{ fontSize: 11 }}>total</div>
                  </div>
                )}
              </div>
            )}

            {paymentResult.bookingReference && (
              <div className="text-green-700 dark:text-green-400" style={{ marginBottom: 14, fontSize: 13 }}>
                <strong>Booking Reference:</strong>{" "}
                {paymentResult.bookingReference}
              </div>
            )}

            <a
              href={paymentResult.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "16px",
                borderRadius: 12,
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
              className="text-slate-600 dark:text-slate-400"
              style={{
                textAlign: "center",
                fontSize: 12,
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