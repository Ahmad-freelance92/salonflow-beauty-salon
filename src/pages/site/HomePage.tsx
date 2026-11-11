import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Clock, MapPin, Star, Sparkles } from 'lucide-react';
import type { Location, Service } from '@/types';
import { fetchLocations, fetchServices } from '@/lib/db';

const testimonials = [
  { name: 'Jessica M.', role: 'Color client, 2 years', quote: 'Mei completely transformed my hair with the most natural balayage I have ever had. The whole experience felt like a retreat.', rating: 5 },
  { name: 'Anthony R.', role: 'Regular cut client', quote: 'Jordan is the best in the city for a clean fade. Booking online took 30 seconds and I never have to wait.', rating: 5 },
  { name: 'Priya S.', role: 'Bridal client', quote: 'Sofia did my wedding updo and I cried happy tears. Every guest asked who did my hair. Pure magic.', rating: 5 },
  { name: 'Dana K.', role: 'Blowout regular', quote: 'I come in every Friday for a blowout before the weekend. The salon is gorgeous and the team is so warm.', rating: 5 },
];

export default function HomePage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    Promise.all([fetchLocations(), fetchServices(true)])
      .then(([l, s]) => {
        setLocations(l);
        setServices(s.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7195803/pexels-photo-7195803.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800"
            alt="Elegant salon interior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/85 via-charcoal-900/60 to-charcoal-900/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold-400">
              <Sparkles className="h-3.5 w-3.5" /> New York's Premier Salon
            </span>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight text-ivory lg:text-7xl">
              Your Beauty, Your Time.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/80">
              Discover exceptional hair care and personalized beauty services across two flagship Manhattan locations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/book" className="btn-gold">
                Book Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="btn-outline border-ivory/30 text-ivory hover:bg-ivory hover:text-charcoal-900">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-gold-600">Our Services</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 lg:text-5xl">
            Crafted For You
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-900/60">
            From precision cuts to balayage and bridal styling, every service is delivered by master stylists using premium products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="card group overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.image_url ?? ''}
                  alt={s.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal-900">{s.name}</h3>
                  <span className="font-serif text-xl font-semibold text-gold-600">${s.price}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-900/60">{s.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-charcoal-900/50">
                  <Clock className="h-3.5 w-3.5" /> {s.duration_minutes} minutes
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services" className="btn-outline">
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-beige-100 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gold-600">Visit Us</p>
            <h2 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 lg:text-5xl">
              Two Manhattan Locations
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {locations.map((loc) => (
              <div key={loc.id} className="card overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={loc.image_url ?? ''} alt={loc.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal-900">{loc.name}</h3>
                  <p className="mt-2 flex items-start gap-2 text-sm text-charcoal-900/70">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    {loc.address}, {loc.city}, {loc.state} {loc.zip}
                  </p>
                  <Link to={`/book?location=${loc.id}`} className="btn-primary mt-5">
                    Book at this Location <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-gold-600">Loved By Our Clients</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 lg:text-5xl">
            Kind Words
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 text-gold-500">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-900/70">“{t.quote}”</p>
              <div className="mt-5">
                <p className="font-medium text-charcoal-900">{t.name}</p>
                <p className="text-xs text-charcoal-900/50">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-charcoal-900/40">
          Testimonials are fictional demo content for demonstration purposes.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-900 py-20">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="font-serif text-4xl font-semibold text-ivory lg:text-5xl">
            Ready For Your Transformation?
          </h2>
          <p className="mt-4 text-ivory/70">
            Book your appointment in under a minute. Choose your location, service, and stylist — we'll handle the rest.
          </p>
          <Link to="/book" className="btn-gold mt-8">
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
