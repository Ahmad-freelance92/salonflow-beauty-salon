import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import type { Service } from '@/types';
import { fetchServices } from '@/lib/db';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices(true)
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-beige-100 py-16">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-gold-600">Our Menu</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 lg:text-6xl">
            Services & Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-900/60">
            Every service includes a personalized consultation. Prices below are fictional demonstration prices for this prototype.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-beige-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="card group flex flex-col overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image_url ?? ''}
                    alt={s.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-900">{s.name}</h3>
                    <span className="font-serif text-2xl font-semibold text-gold-600">${s.price}</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-900/60">{s.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs text-charcoal-900/50">
                      <Clock className="h-3.5 w-3.5" /> {s.duration_minutes} minutes
                    </span>
                    <Link
                      to={`/book?service=${s.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 transition hover:text-gold-500"
                    >
                      Book this <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-blush-50 p-8 text-center">
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900">Not sure which service you need?</h2>
          <p className="mt-3 text-charcoal-900/60">Our stylists will guide you during your personalized consultation.</p>
          <Link to="/book" className="btn-gold mt-6">
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
