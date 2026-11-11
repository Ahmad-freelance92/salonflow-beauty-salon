import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, MapPin, Scissors, User, Calendar,
  Clock, Sparkles, CheckCircle2, Loader2,
} from 'lucide-react';
import type { Location, Service, Stylist } from '@/types';
import {
  fetchBookedSlots, fetchLocations, fetchServices, fetchStylists, createBooking,
} from '@/lib/db';
import { useToast } from '@/components/Toast';
import { TIME_SLOTS, dayName, dayNumber, formatDateDisplay, monthName, nextDays, todayISO } from '@/lib/time';

const STEPS = ['Location', 'Service', 'Stylist', 'Date', 'Time', 'Your Info', 'Confirm'];

interface FormInfo {
  full_name: string;
  email: string;
  phone: string;
  special_requests: string;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);

  const [locationId, setLocationId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [stylistId, setStylistId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [info, setInfo] = useState<FormInfo>({ full_name: '', email: '', phone: '', special_requests: '' });

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([fetchLocations(), fetchServices(true), fetchStylists()])
      .then(([l, s, st]) => {
        setLocations(l);
        setServices(s);
        setStylists(st);
        const preLoc = searchParams.get('location');
        const preSvc = searchParams.get('service');
        if (preLoc && l.some((x) => x.id === preLoc)) {
          setLocationId(preLoc);
          setStep(1);
        }
        if (preSvc && s.some((x) => x.id === preSvc)) {
          setServiceId(preSvc);
          if (!preLoc) setStep(1);
        }
      })
      .catch(() => notify('Could not load booking data. Please try again.', 'error'));
  }, [notify, searchParams]);

  useEffect(() => {
    if (step === 4 && stylistId && date) {
      setLoadingSlots(true);
      fetchBookedSlots(stylistId, date)
        .then(setBookedSlots)
        .catch(() => setBookedSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [step, stylistId, date]);

  const availableStylists = useMemo(
    () => stylists.filter((s) => !locationId || s.location_id === locationId),
    [stylists, locationId],
  );

  const selectedLocation = locations.find((l) => l.id === locationId);
  const selectedService = services.find((s) => s.id === serviceId);
  const selectedStylist = stylists.find((s) => s.id === stylistId);

  const today = todayISO();
  const dateOptions = useMemo(() => (date ? nextDays(date, 14) : nextDays(today, 14)), [date, today]);

  function validateInfo(): boolean {
    const e: Record<string, string> = {};
    if (!info.full_name.trim()) e.full_name = 'Please enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(info.email)) e.email = 'Please enter a valid email.';
    if (info.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a valid phone number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 5 && !validateInfo()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!validateInfo()) {
      setStep(5);
      return;
    }
    setSubmitting(true);
    try {
      const appt = await createBooking({
        customer: { full_name: info.full_name, email: info.email, phone: info.phone },
        service_id: serviceId,
        stylist_id: stylistId,
        location_id: locationId,
        date,
        time,
        special_requests: info.special_requests,
      });
      setConfirmedRef(appt.booking_ref);
      setStep(STEPS.length);
      notify('Booking confirmed! We have sent the details to your email.', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not complete your booking. Please try again.';
      notify(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(0);
    setLocationId('');
    setServiceId('');
    setStylistId('');
    setDate('');
    setTime('');
    setInfo({ full_name: '', email: '', phone: '', special_requests: '' });
    setConfirmedRef('');
    navigate('/book');
  }

  // Confirmation screen
  if (confirmedRef) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 lg:px-8">
        <div className="card animate-fade-in p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold text-charcoal-900">Booking Confirmed!</h1>
          <p className="mt-3 text-charcoal-900/60">
            Thank you, {info.full_name.split(' ')[0]}. Your appointment has been received and is pending confirmation.
          </p>
          <div className="mt-6 rounded-2xl bg-beige-100 p-6 text-left">
            <p className="text-xs uppercase tracking-widest text-charcoal-900/50">Your Booking Reference</p>
            <p className="mt-1 font-serif text-3xl font-semibold text-gold-600">{confirmedRef}</p>
            <div className="mt-5 space-y-2 text-sm">
              <Row label="Location" value={selectedLocation?.name ?? ''} />
              <Row label="Service" value={`${selectedService?.name ?? ''} — $${selectedService?.price ?? ''}`} />
              <Row label="Stylist" value={selectedStylist?.name ?? ''} />
              <Row label="Date" value={formatDateDisplay(date)} />
              <Row label="Time" value={time} />
            </div>
          </div>
          <p className="mt-5 text-xs text-charcoal-900/40">
            Please save your booking reference. This is a demo prototype — no real email is sent.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={reset} className="btn-primary">Book Another</button>
            <button onClick={() => navigate('/')} className="btn-outline">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  const canProceed = [
    !!locationId,
    !!serviceId,
    !!stylistId,
    !!date,
    !!time,
    validateInfoSilent(info),
    true,
  ][step];

  function validateInfoSilent(i: FormInfo): boolean {
    return !!i.full_name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.email) && i.phone.replace(/\D/g, '').length >= 10;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-charcoal-900 lg:text-5xl">Book Your Appointment</h1>
        <p className="mt-3 text-charcoal-900/60">Seven quick steps to your next transformation.</p>
      </div>

      {/* Stepper */}
      <div className="mt-10 overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                i < step ? 'bg-emerald-50 text-emerald-600'
                : i === step ? 'bg-charcoal-900 text-ivory'
                : 'bg-beige-100 text-charcoal-900/40'
              }`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-gold-500 text-white' : 'bg-beige-300 text-charcoal-900/50'
                }`}>
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {label}
              </div>
              {i < STEPS.length - 1 && <div className="mx-1 h-px w-4 bg-beige-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-8 p-6 lg:p-10">
        {/* Step 0: Location */}
        {step === 0 && (
          <StepWrap icon={<MapPin className="h-5 w-5 text-gold-600" />} title="Choose a Salon Location">
            <div className="grid gap-4 md:grid-cols-2">
              {locations.map((l) => (
                <SelectCard
                  key={l.id}
                  active={locationId === l.id}
                  onClick={() => { setLocationId(l.id); setStylistId(''); }}
                  image={l.image_url}
                  title={l.name}
                  subtitle={`${l.address}, ${l.city}, ${l.state} ${l.zip}`}
                />
              ))}
            </div>
          </StepWrap>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <StepWrap icon={<Scissors className="h-5 w-5 text-gold-600" />} title="Choose a Beauty Service">
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={`flex gap-4 rounded-2xl border-2 p-4 text-left transition ${
                    serviceId === s.id ? 'border-gold-500 bg-gold-500/5' : 'border-beige-200 hover:border-gold-400'
                  }`}
                >
                  <img src={s.image_url ?? ''} alt={s.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-semibold text-charcoal-900">{s.name}</h3>
                      <span className="font-serif text-lg font-semibold text-gold-600">${s.price}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-charcoal-900/60">{s.description}</p>
                    <p className="mt-1 text-xs text-charcoal-900/40">{s.duration_minutes} minutes</p>
                  </div>
                </button>
              ))}
            </div>
          </StepWrap>
        )}

        {/* Step 2: Stylist */}
        {step === 2 && (
          <StepWrap icon={<User className="h-5 w-5 text-gold-600" />} title="Choose Your Stylist">
            {availableStylists.length === 0 ? (
              <p className="text-sm text-charcoal-900/50">No stylists available at this location. Please choose another location.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableStylists.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStylistId(st.id)}
                    className={`rounded-2xl border-2 p-4 text-center transition ${
                      stylistId === st.id ? 'border-gold-500 bg-gold-500/5' : 'border-beige-200 hover:border-gold-400'
                    }`}
                  >
                    <img
                      src={st.image_url ?? ''}
                      alt={st.name}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                    <h3 className="mt-3 font-serif text-lg font-semibold text-charcoal-900">{st.name}</h3>
                    <p className="text-xs text-gold-600">{st.specialty}</p>
                    <p className="mt-1 text-xs text-charcoal-900/50">{st.available ? 'Available' : 'On leave'}</p>
                  </button>
                ))}
              </div>
            )}
          </StepWrap>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <StepWrap icon={<Calendar className="h-5 w-5 text-gold-600" />} title="Select a Booking Date">
            <p className="mb-4 text-sm text-charcoal-900/60">{monthName(today)} — choose any of the next 14 days.</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {dateOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDate(d); setTime(''); }}
                  className={`rounded-xl border-2 p-3 text-center transition ${
                    date === d ? 'border-gold-500 bg-gold-500 text-white' : 'border-beige-200 hover:border-gold-400'
                  }`}
                >
                  <p className={`text-[10px] uppercase ${date === d ? 'text-white/80' : 'text-charcoal-900/50'}`}>{dayName(d)}</p>
                  <p className="mt-1 font-serif text-xl font-semibold">{dayNumber(d)}</p>
                </button>
              ))}
            </div>
          </StepWrap>
        )}

        {/* Step 4: Time */}
        {step === 4 && (
          <StepWrap icon={<Clock className="h-5 w-5 text-gold-600" />} title="Select an Available Time Slot">
            <p className="mb-4 text-sm text-charcoal-900/60">
              {selectedStylist ? `Times with ${selectedStylist.name} on ${formatDateDisplay(date)}.` : ''}
            </p>
            {loadingSlots ? (
              <div className="flex items-center gap-2 text-sm text-charcoal-900/50">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots…
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                {TIME_SLOTS.map((slot) => {
                  const booked = bookedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      disabled={booked}
                      onClick={() => setTime(slot)}
                      className={`rounded-xl border-2 px-2 py-2.5 text-sm transition ${
                        booked
                          ? 'cursor-not-allowed border-beige-100 bg-beige-50 text-charcoal-900/30 line-through'
                          : time === slot
                            ? 'border-gold-500 bg-gold-500 text-white'
                            : 'border-beige-200 hover:border-gold-400 text-charcoal-900'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </StepWrap>
        )}

        {/* Step 5: Info */}
        {step === 5 && (
          <StepWrap icon={<Sparkles className="h-5 w-5 text-gold-600" />} title="Enter Your Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="name">Full Name</label>
                <input id="name" className="input-field" value={info.full_name}
                  onChange={(e) => setInfo({ ...info, full_name: e.target.value })} placeholder="Jane Doe" />
                {errors.full_name && <p className="mt-1 text-xs text-rose-500">{errors.full_name}</p>}
              </div>
              <div>
                <label className="label-field" htmlFor="email">Email</label>
                <input id="email" type="email" className="input-field" value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })} placeholder="jane@example.com" />
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
              </div>
              <div>
                <label className="label-field" htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" className="input-field" value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })} placeholder="(212) 555-0100" />
                {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="special">Special Requests (optional)</label>
                <textarea id="special" rows={3} className="input-field resize-none" value={info.special_requests}
                  onChange={(e) => setInfo({ ...info, special_requests: e.target.value })}
                  placeholder="Tell us about any preferences, allergies, or occasion details." />
              </div>
            </div>
          </StepWrap>
        )}

        {/* Step 6: Confirm */}
        {step === 6 && (
          <StepWrap icon={<Check className="h-5 w-5 text-gold-600" />} title="Review & Confirm">
            <div className="overflow-hidden rounded-2xl border border-beige-200">
              <div className="bg-beige-100 px-5 py-3 text-sm font-medium text-charcoal-900">Booking Summary</div>
              <div className="divide-y divide-beige-100">
                <Row label="Location" value={selectedLocation?.name ?? ''} />
                <Row label="Service" value={`${selectedService?.name ?? ''} — $${selectedService?.price ?? ''} (${selectedService?.duration_minutes ?? ''} min)`} />
                <Row label="Stylist" value={`${selectedStylist?.name ?? ''} — ${selectedStylist?.specialty ?? ''}`} />
                <Row label="Date" value={formatDateDisplay(date)} />
                <Row label="Time" value={time} />
                <Row label="Name" value={info.full_name} />
                <Row label="Email" value={info.email} />
                <Row label="Phone" value={info.phone} />
                {info.special_requests && <Row label="Notes" value={info.special_requests} />}
              </div>
            </div>
            <p className="mt-4 text-xs text-charcoal-900/40">
              By confirming you agree to SalonFlow's demo cancellation policy. This is a demonstration prototype.
            </p>
          </StepWrap>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-900/60 transition hover:text-charcoal-900 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 6 ? (
            <button onClick={next} disabled={!canProceed} className="btn-primary">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn-gold">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : <>Confirm Booking <Check className="h-4 w-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepWrap({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-50">{icon}</span>
        <h2 className="font-serif text-2xl font-semibold text-charcoal-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SelectCard({ active, onClick, image, title, subtitle }: {
  active: boolean; onClick: () => void; image: string | null; title: string; subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 overflow-hidden rounded-2xl border-2 p-3 text-left transition ${
        active ? 'border-gold-500 bg-gold-500/5' : 'border-beige-200 hover:border-gold-400'
      }`}
    >
      <img src={image ?? ''} alt={title} className="h-20 w-20 rounded-xl object-cover" />
      <div>
        <h3 className="font-serif text-lg font-semibold text-charcoal-900">{title}</h3>
        <p className="mt-0.5 text-xs text-charcoal-900/60">{subtitle}</p>
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <span className="text-charcoal-900/50">{label}</span>
      <span className="text-right font-medium text-charcoal-900">{value}</span>
    </div>
  );
}
