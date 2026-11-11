import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/locations', label: 'Locations' },
    { to: '/book', label: 'Book' },
  ];

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 border-b border-beige-200/60 bg-ivory/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 text-ivory">
            <Scissors className="h-4 w-4" />
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-charcoal-900">
            SalonFlow
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive(l.to) ? 'text-gold-600' : 'text-charcoal-900/70 hover:text-charcoal-900'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/book" className="btn-gold">
            Book Appointment
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6 text-charcoal-900" /> : <Menu className="h-6 w-6 text-charcoal-900" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-beige-200 bg-ivory md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(l.to) ? 'bg-blush-50 text-gold-600' : 'text-charcoal-900/80 hover:bg-beige-100'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/book" onClick={() => setOpen(false)} className="btn-gold mt-2 w-full">
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
