import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-charcoal-900">
                <Scissors className="h-4 w-4" />
              </span>
              <span className="font-serif text-2xl font-semibold">SalonFlow</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
              A premium beauty salon experience across two New York locations. Your beauty, your time.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/10 transition hover:bg-gold-500 hover:text-charcoal-900" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/10 transition hover:bg-gold-500 hover:text-charcoal-900" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-gold-400">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              <li><Link to="/" className="hover:text-gold-400">Home</Link></li>
              <li><Link to="/services" className="hover:text-gold-400">Services</Link></li>
              <li><Link to="/locations" className="hover:text-gold-400">Locations</Link></li>
              <li><Link to="/book" className="hover:text-gold-400">Book Appointment</Link></li>
              <li><Link to="/admin" className="hover:text-gold-400">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-gold-400">Forsyth Street</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />104 Forsyth Street, New York, NY 10002</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-400" />(212) 555-0142</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-400" />forsyth@salonflow.demo</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-gold-400">Broome Street</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />139 Broome Street, New York, NY 10002</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-400" />(212) 555-0188</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-400" />broome@salonflow.demo</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ivory/10 pt-6 text-xs text-ivory/50">
          <p>
            SalonFlow is a demonstration concept inspired by the business model of a two-location beauty salon.
            All data, prices, and testimonials are fictional demo content — this is not the official salon software.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} SalonFlow Demo. For demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
