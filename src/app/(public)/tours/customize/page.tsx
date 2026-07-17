'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const TOUR_TYPES = [
  { value: 'ADVENTURE', label: 'Adventure', icon: '🧗' },
  { value: 'NATURE',    label: 'Nature',    icon: '🌿' },
  { value: 'CULTURAL',  label: 'Cultural',  icon: '🏛️' },
  { value: 'ROMANTIC',  label: 'Romantic',  icon: '💑' },
  { value: 'WILDLIFE',  label: 'Wildlife',  icon: '🐘' },
  { value: 'FAMILY',    label: 'Family',    icon: '👨‍👩‍👧‍👦' },
  { value: 'BEACH',     label: 'Beach',     icon: '🏖️' },
  { value: 'LUXURY',    label: 'Luxury',    icon: '✨' },
];

const DURATION_OPTIONS = [
  '1–3 days',
  '4–7 days',
  '8–14 days',
  '15–21 days',
  '22+ days',
];

const GROUP_SIZES = [
  { label: 'Solo',          value: '1',    icon: '🧍' },
  { label: 'Couple',        value: '2',    icon: '👫' },
  { label: 'Small (3–6)',   value: '3–6',  icon: '👨‍👩‍👧‍👦' },
  { label: 'Medium (7–15)', value: '7–15', icon: '👥' },
  { label: 'Large (16+)',   value: '16+',  icon: '🚌' },
];

const BUDGET_RANGES = [
  'Under $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500 – $5,000',
  '$5,000+',
  'Flexible',
];

const TOTAL_STEPS = 5;
const STEP_LABELS = [
  'Contact',
  'Tour Type',
  'Duration & Group',
  'Budget & Date',
  'Destinations',
];

function buildMessage(f: {
  tourTypes: string[];
  duration: string;
  groupSize: string;
  budget: string;
  startDate: string;
  destinations: string;
  specialRequests: string;
}): string {
  return [
    `Tour Types: ${f.tourTypes.length ? f.tourTypes.join(', ') : 'Not specified'}`,
    `Duration: ${f.duration || 'Not specified'}`,
    `Group Size: ${f.groupSize || 'Not specified'}`,
    `Budget Range: ${f.budget || 'Not specified'}`,
    `Preferred Start Date: ${f.startDate || 'Flexible'}`,
    `Preferred Destinations: ${f.destinations || 'Open to suggestions'}`,
    '',
    'Special Requests / Notes:',
    f.specialRequests || 'None',
  ].join('\n');
}

// ── Shared small components ───────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 ' +
  'focus:border-teal-400 transition-colors bg-white';

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Stepper({
  current,
  labels,
  onStepClick,
}: {
  current: number;
  labels: string[];
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-start w-full px-6 sm:px-10 py-6 bg-white">
      {labels.map((label, i) => {
        const stepNum     = i + 1;
        const isActive    = stepNum === current;
        const isCompleted = stepNum < current;
        const isClickable = isCompleted;

        return (
          <div
            key={label}
            className={`flex items-center ${i === labels.length - 1 ? '' : 'flex-1'}`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepNum)}
                disabled={!isClickable}
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'text-xs font-bold border-2 transition-colors flex-shrink-0',
                  isCompleted
                    ? 'bg-teal-600 border-teal-600 text-white cursor-pointer'
                    : isActive
                      ? 'border-teal-500 text-teal-600 bg-white'
                      : 'border-gray-200 text-gray-300 bg-white cursor-default',
                ].join(' ')}
              >
                {isCompleted ? '✓' : stepNum}
              </button>
              <span
                className={[
                  'hidden sm:block text-[11px] font-medium text-center max-w-[90px] leading-tight',
                  isActive
                    ? 'text-teal-700'
                    : isCompleted
                      ? 'text-teal-600'
                      : 'text-gray-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>

            {i !== labels.length - 1 && (
              <div
                className={[
                  'flex-1 h-[2px] mx-2 mt-4 sm:mt-0 transition-colors',
                  isCompleted ? 'bg-teal-600' : 'bg-gray-200',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizeTourPage() {
  // Wizard step
  const [step, setStep] = useState(1);

  // Contact info
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Tour preferences
  const [tourTypes,       setTourTypes]       = useState<string[]>([]);
  const [duration,        setDuration]        = useState('');
  const [groupSize,       setGroupSize]       = useState('');
  const [budget,          setBudget]          = useState('');
  const [startDate,       setStartDate]       = useState('');
  const [destinations,    setDestinations]    = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const toggleTourType = (value: string) => {
    setTourTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goNext = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim()) {
        setError('Please fill in your name and email.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const goToStep = (target: number) => {
    if (target < step) setStep(target);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email.');
      setStep(1);
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setStep(1);
      return;
    }
    setError(null);
    setSubmitting(true);

    const message = buildMessage({
      tourTypes, duration, groupSize, budget,
      startDate, destinations, specialRequests,
    });

    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     name.trim(),
          email:    email.trim(),
          phone:    phone.trim(),
          subject:  'Custom Tour Request',
          message,
          category: 'GENERAL',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string })?.message ?? `Server error ${res.status}`);
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(`Failed to send request: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Thank you,{' '}
            <span className="font-semibold text-gray-700">{name}</span>! Our travel
            experts will review your custom tour request and get back to you at{' '}
            <span className="font-semibold text-teal-600">{email}</span> within 24
            hours.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            Check your spam folder if you don&apos;t hear from us.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/tours"
              className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Browse Tour Packages
            </Link>
            <Link
              href="/"
              className="block w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-52 flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/600?random=customize"
          alt="Customize your Sri Lanka tour"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-xs mb-2">
            Tailor-Made for You
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
            Customize Your Sri Lanka Tour
          </h1>
          <p className="text-white/75 text-sm mt-2">
            Tell us your dream trip — we&apos;ll make it happen.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-teal-600">Tours</Link>
          <span>/</span>
          <span className="text-gray-600">Customize</span>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header bar */}
          <div className="bg-teal-600 px-8 py-4 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Custom Tour Request Form</p>
            <span className="text-teal-200 text-xs">
              Step {step} of {TOTAL_STEPS} · Free · No commitment
            </span>
          </div>

          {/* Step indicator */}
          <Stepper
            current={step}
            labels={STEP_LABELS}
            onStepClick={goToStep}
          />

          <div className="px-8 pb-8 space-y-8">

            {/* ── Step 1: Contact Info ── */}
            {step === 1 && (
              <section>
                <SectionHeader
                  number="1"
                  title="Your Contact Details"
                  subtitle="We'll use these to send your personalised itinerary."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="sm:col-span-2">
                    <FieldLabel required>Full Name</FieldLabel>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. James Anderson"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>Phone / WhatsApp</FieldLabel>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 000 0000"
                      className={inputCls}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 2: Tour Type ── */}
            {step === 2 && (
              <section>
                <SectionHeader
                  number="2"
                  title="What Kind of Tour?"
                  subtitle="Select all that interest you — we'll blend them together."
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {TOUR_TYPES.map((t) => {
                    const active = tourTypes.includes(t.value);
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => toggleTourType(t.value)}
                        className={[
                          'flex flex-col items-center gap-1.5 py-3 px-2',
                          'rounded-xl border-2 text-sm font-medium',
                          'transition-all cursor-pointer',
                          active
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-600',
                          'hover:border-teal-400',
                        ].join(' ')}
                      >
                        <span className="text-2xl">{t.icon}</span>
                        <span className="text-xs">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Step 3: Duration + Group ── */}
            {step === 3 && (
              <section>
                <SectionHeader
                  number="3"
                  title="Duration & Group Size"
                  subtitle="How long and how many people?"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <FieldLabel>Trip Duration</FieldLabel>
                    <div className="flex flex-col gap-2 mt-2">
                      {DURATION_OPTIONS.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="duration"
                            value={opt}
                            checked={duration === opt}
                            onChange={() => setDuration(opt)}
                            className="accent-teal-600 w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Group Size</FieldLabel>
                    <div className="flex flex-col gap-2 mt-2">
                      {GROUP_SIZES.map((g) => (
                        <label key={g.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="groupSize"
                            value={g.value}
                            checked={groupSize === g.value}
                            onChange={() => setGroupSize(g.value)}
                            className="accent-teal-600 w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{g.icon} {g.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 4: Budget + Date ── */}
            {step === 4 && (
              <section>
                <SectionHeader
                  number="4"
                  title="Budget & Travel Date"
                  subtitle="Per person estimates help us tailor the best options."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <FieldLabel>Budget per Person (USD)</FieldLabel>
                    <div className="flex flex-col gap-2 mt-2">
                      {BUDGET_RANGES.map((b) => (
                        <label key={b} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="budget"
                            value={b}
                            checked={budget === b}
                            onChange={() => setBudget(b)}
                            className="accent-teal-600 w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Preferred Start Date</FieldLabel>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={inputCls + ' mt-2'}
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      Leave blank if your dates are flexible.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 5: Destinations + Notes ── */}
            {step === 5 && (
              <section>
                <SectionHeader
                  number="5"
                  title="Destinations & Special Requests"
                  subtitle="Tell us more so we can craft the perfect trip."
                />
                <div className="space-y-4 mt-4">
                  <div>
                    <FieldLabel>Preferred Destinations in Sri Lanka</FieldLabel>
                    <input
                      type="text"
                      value={destinations}
                      onChange={(e) => setDestinations(e.target.value)}
                      placeholder="e.g. Kandy, Ella, Galle, Yala..."
                      className={inputCls}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Leave blank if you&apos;d like our experts to suggest.
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Special Requests or Notes</FieldLabel>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={4}
                      placeholder="e.g. vegetarian meals, wheelchair access, anniversary surprise, specific hotels, avoid long drives..."
                      className={inputCls + ' resize-none'}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── Error message ── */}
            {error && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-100">
                <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
              {/* Privacy note — only on last step */}
              {step === TOTAL_STEPS ? (
                <p className="text-xs text-gray-400 text-left">
                  🔒 Your information is kept private and never shared.
                  <br />
                  Our team will reply within 24 hours.
                </p>
              ) : (
                <div /> /* spacer so Back button stays right-aligned on early steps */
              )}

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>✈️ Send My Request</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-gray-400">
          {[
            { icon: '✅', label: 'Free consultation' },
            { icon: '⚡', label: 'Reply within 24h' },
            { icon: '🔒', label: 'No payment required' },
            { icon: '🌟', label: 'Expert local guides' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
