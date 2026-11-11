import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import type { Location } from '@/types';
import { fetchLocations } from '@/lib/db';
import { useToast } from '@/components/Toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function LocationsAdminPage() {
  const { notify } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => notify('Could not load locations.', 'error'))
      .finally(() => setLoading(false));
  }, [notify]);

  if (loading) {
    return <div className="flex h-48 items-center justify-center text-charcoal-900/40"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Locations</h1>
        <p className="text-sm text-charcoal-900/50">View your salon locations</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {locations.map((loc) => (
          <div key={loc.id} className="card overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={loc.image_url ?? ''} alt={loc.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h2 className="font-serif text-2xl font-semibold text-charcoal-900">{loc.name}</h2>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-start gap-3 text-charcoal-900/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {loc.address}, {loc.city}, {loc.state} {loc.zip}</p>
                <p className="flex items-center gap-3 text-charcoal-900/70"><Phone className="h-4 w-4 text-gold-600" /> {loc.phone}</p>
                <p className="flex items-center gap-3 text-charcoal-900/70"><Mail className="h-4 w-4 text-gold-600" /> {loc.email}</p>
              </div>
              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal-900/50">
                  <Clock className="h-3.5 w-3.5 text-gold-600" /> Opening Hours
                </h3>
                <div className="mt-2 overflow-hidden rounded-xl border border-beige-200">
                  {DAYS.map((d) => (
                    <div key={d} className="flex items-center justify-between border-b border-beige-100 px-4 py-2 text-sm last:border-0">
                      <span className="text-charcoal-900/70">{d}</span>
                      <span className={loc.hours[d] === 'Closed' ? 'text-rose-500' : 'text-charcoal-900'}>{loc.hours[d]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex h-32 items-center justify-center rounded-xl bg-beige-100 text-sm text-charcoal-900/40">
                <MapPin className="mr-2 h-5 w-5" /> Map placeholder — {loc.address}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-charcoal-900/40">
        Location management is view-only in this prototype. Editing location addresses and hours is not available in the demo.
      </p>
    </div>
  );
}
