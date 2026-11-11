import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, Navigation } from 'lucide-react';
import type { Location } from '@/types';
import { fetchLocations } from '@/lib/db';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <section className="bg-beige-100 py-16">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-gold-600">Find Us</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 lg:text-6xl">
            Our Locations
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-900/60">
            Two flagship salons in Lower Manhattan, designed for comfort and crafted for beauty.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="space-y-10">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="card h-[28rem] animate-pulse bg-beige-100" />
              ))}
            </div>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="card overflow-hidden lg:grid lg:grid-cols-2">
                <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                  <img src={loc.image_url ?? ''} alt={loc.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-semibold text-charcoal-900">{loc.name}</h2>
                  <div className="mt-5 space-y-3 text-sm">
                    <p className="flex items-start gap-3 text-charcoal-900/70">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      {loc.address}, {loc.city}, {loc.state} {loc.zip}
                    </p>
                    <p className="flex items-center gap-3 text-charcoal-900/70">
                      <Phone className="h-4 w-4 shrink-0 text-gold-600" /> {loc.phone}
                    </p>
                    <p className="flex items-center gap-3 text-charcoal-900/70">
                      <Mail className="h-4 w-4 shrink-0 text-gold-600" /> {loc.email}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-charcoal-900/60">
                      <Clock className="h-4 w-4 text-gold-600" /> Opening Hours
                    </h3>
                    <div className="mt-3 overflow-hidden rounded-xl border border-beige-200">
                      {days.map((d) => (
                        <div
                          key={d}
                          className="flex items-center justify-between border-b border-beige-100 px-4 py-2.5 text-sm last:border-0"
                        >
                          <span className="text-charcoal-900/70">{d}</span>
                          <span className={loc.hours[d] === 'Closed' ? 'text-rose-500' : 'text-charcoal-900'}>
                            {loc.hours[d]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-6 flex h-32 items-center justify-center rounded-xl bg-beige-100 text-charcoal-900/40">
                    <Navigation className="h-6 w-6" />
                    <span className="ml-2 text-sm">Map placeholder — {loc.address}</span>
                  </div>

                  <Link to={`/book?location=${loc.id}`} className="btn-primary mt-6">
                    Book at this Location <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
