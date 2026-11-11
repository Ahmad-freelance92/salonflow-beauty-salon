import { Sparkles, Mail, Lock, Bell, Globe, ShieldCheck, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Settings</h1>
        <p className="text-sm text-charcoal-900/50">Manage your salon configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
            <Sparkles className="h-5 w-5 text-gold-600" /> Business Profile
          </h2>
          <div className="mt-4 space-y-4">
            <Field label="Salon Name" value="SalonFlow Demo" />
            <Field label="Currency" value="USD ($)" />
            <Field label="Time Zone" value="America/New_York (EST)" />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
            <Bell className="h-5 w-5 text-gold-600" /> Notifications
          </h2>
          <div className="mt-4 space-y-3">
            <Toggle label="Email notifications for new bookings" defaultOn />
            <Toggle label="SMS reminders to customers" defaultOn={false} />
            <Toggle label="Daily summary report" defaultOn />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
            <Globe className="h-5 w-5 text-gold-600" /> Booking Rules
          </h2>
          <div className="mt-4 space-y-3">
            <Toggle label="Require admin confirmation for new bookings" defaultOn />
            <Toggle label="Allow same-day bookings" defaultOn={false} />
            <Toggle label="Allow customers to cancel online" defaultOn />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
            <ShieldCheck className="h-5 w-5 text-gold-600" /> Security
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gold-500/10 px-4 py-3">
              <Lock className="h-4 w-4 text-gold-600" />
              <p className="text-sm text-charcoal-900/70">Admin session: <span className="font-medium text-charcoal-900">demo mode</span></p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-beige-100 px-4 py-3">
              <Mail className="h-4 w-4 text-charcoal-900/50" />
              <p className="text-sm text-charcoal-900/70">Admin email: <span className="font-medium text-charcoal-900">admin@salonflow.demo</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="card flex items-start gap-4 p-6">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
        <div>
          <h3 className="font-serif text-lg font-semibold text-charcoal-900">About This Prototype</h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal-900/60">
            SalonFlow is a demonstration concept inspired by the business model of a two-location beauty salon.
            All data — customers, appointments, testimonials, and prices — is fictional demo content. This is not
            the official salon software, and admin authentication here is for demonstration only, not production security.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input className="input-field" defaultValue={value} disabled />
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-beige-200 px-4 py-3">
      <span className="text-sm text-charcoal-900/80">{label}</span>
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input type="checkbox" defaultChecked={defaultOn} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-beige-200 transition peer-checked:bg-gold-500" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
