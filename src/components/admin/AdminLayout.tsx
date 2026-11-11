import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Calendar, Scissors, Users, MapPin,
  UserCircle, Settings, LogOut, Menu, X, Sparkles,
} from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/services', label: 'Services', icon: Scissors },
  { to: '/admin/stylists', label: 'Stylists', icon: Users },
  { to: '/admin/locations', label: 'Locations', icon: MapPin },
  { to: '/admin/customers', label: 'Customers', icon: UserCircle },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

interface Props {
  children: ReactNode;
  onLogout: () => void;
}

export default function AdminLayout({ children, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to) && pathname !== '/admin';

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-beige-200 bg-white lg:flex">
        <SidebarContent onLogout={onLogout} isActive={isActive} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 text-charcoal-900/50" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onLogout={onLogout} isActive={isActive} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-beige-200 bg-white/90 px-5 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6 text-charcoal-900" />
            </button>
            <span className="text-sm font-medium text-charcoal-900/60">SalonFlow Admin</span>
          </div>
          <Link to="/" className="text-xs font-medium text-gold-600 hover:text-gold-500">
            View Site →
          </Link>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  onLogout, isActive, onNavigate,
}: {
  onLogout: () => void;
  isActive: (to: string, exact?: boolean) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2 border-b border-beige-100 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 text-ivory">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="font-serif text-xl font-semibold text-charcoal-900">SalonFlow</span>
      </Link>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? isActive(item.to, true) : isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-charcoal-900 text-ivory' : 'text-charcoal-900/70 hover:bg-beige-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-beige-100 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}
