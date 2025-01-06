export interface Service {
  serviceId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingDetails {
  id?: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  userId?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  bookings?: BookingDetails[];
}