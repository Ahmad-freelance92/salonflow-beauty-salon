import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import HomePage from '@/pages/site/HomePage';
import ServicesPage from '@/pages/site/ServicesPage';
import LocationsPage from '@/pages/site/LocationsPage';
import BookingPage from '@/pages/site/BookingPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardOverview from '@/pages/admin/DashboardOverview';
import AppointmentsPage from '@/pages/admin/AppointmentsPage';
import CalendarPage from '@/pages/admin/CalendarPage';
import CustomersPage from '@/pages/admin/CustomersPage';
import StylistsPage from '@/pages/admin/StylistsPage';
import ServicesAdminPage from '@/pages/admin/ServicesPage';
import LocationsAdminPage from '@/pages/admin/LocationsAdminPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import { fetchAppointments } from '@/lib/db';
import type { AppointmentWithRelations } from '@/types';

const AUTH_KEY = 'salonflow_admin_auth';

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  function login() {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setAuthed(true);
  }
  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  useEffect(() => {
    if (authed) {
      fetchAppointments()
        .then(setAppointments)
        .catch(() => {})
        .finally(() => setLoadingAppts(false));
    }
  }, [authed]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/book" element={<BookingPage />} />
          </Route>

          <Route path="/admin/login" element={
            authed ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={login} />
          } />
          <Route path="/admin" element={
            authed ? (
              <AdminLayout onLogout={logout}>
                <Outlet />
              </AdminLayout>
            ) : <AdminLogin onLogin={login} />
          }>
            <Route index element={<DashboardOverview appointments={appointments} loading={loadingAppts} />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="services" element={<ServicesAdminPage />} />
            <Route path="stylists" element={<StylistsPage />} />
            <Route path="locations" element={<LocationsAdminPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
