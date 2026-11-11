export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  image_url: string | null;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  active: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  image_url: string | null;
  location_id: string | null;
  working_hours: Record<string, string>;
  available: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  notes: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  booking_ref: string;
  customer_id: string;
  service_id: string;
  stylist_id: string;
  location_id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  special_requests: string | null;
  created_at: string;
  // joined fields (optional — populated when selected with relations)
  customer?: Customer;
  service?: Service;
  stylist?: Stylist;
  location?: Location;
}

export interface AppointmentWithRelations extends Appointment {
  customer: Customer;
  service: Service;
  stylist: Stylist;
  location: Location;
}
