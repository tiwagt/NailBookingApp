import { 
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  getFirestore,
  DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BookingDetails, Service } from '../types/index';

export async function createBooking(bookingDetails: BookingDetails) {
  try {
    const bookingData = {
      ...bookingDetails,
      createdAt: Timestamp.now(),
      status: 'pending',
      userId: bookingDetails.userId
    };

    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getUserBookings(userId: string) {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

export async function getAvailableTimeSlots(date: Date) {
  try {
    // Check if the selected date is today
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    // Generate all possible time slots
    const allSlots = [
      '10:00 AM', '10:30 AM', 
      '11:00 AM', '11:30 AM',
      '1:00 PM', '1:30 PM', 
      '2:00 PM', '2:30 PM', 
      '3:00 PM', '3:30 PM',
      '4:00 PM', '4:30 PM',
      '5:00 PM', '5:30 PM',
      '6:00 PM', '6:30 PM',
      '7:00 PM', '7:30 PM'
    ];

    if (isToday) {
      // If it's today, only show future time slots
      const currentHour = today.getHours();
      const currentMinutes = today.getMinutes();
      return allSlots.filter(slot => {
        const [time, period] = slot.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let slotHour = hours;
        if (period === 'PM' && hours !== 12) slotHour += 12;
        if (period === 'AM' && hours === 12) slotHour = 0;
        
        // Compare with current time
        return (slotHour > currentHour) || 
               (slotHour === currentHour && minutes > currentMinutes);
      });
    }

    // For future dates, return all slots
    return allSlots;
  } catch (error) {
    console.error('Error generating available time slots:', error);
    throw error;
  }
}

export const saveBooking = async (booking: BookingDetails) => {
  try {
    const bookingsCollection = collection(db, 'bookings'); // Ensure 'bookings' is the correct collection name
    await addDoc(bookingsCollection, booking);
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error; // Rethrow the error to handle it in the Booking component
  }
};

export const getBookedTimeSlots = async (date: Date) => {
  const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const bookedSlots: string[] = [];

  const bookingsCollection = collection(db, 'bookings');
  const q = query(bookingsCollection, where('date', '==', formattedDate));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const bookingData = doc.data();
    if (bookingData.time) {
      bookedSlots.push(bookingData.time);
    }
  });

  return bookedSlots;
};

export const getUpcomingAppointments = async (userId: string): Promise<BookingDetails[]> => {
  const appointmentsRef = collection(db, "bookings");
  
  // Create a query to fetch only appointments that are not canceled
  const q = query(appointmentsRef, where("userId", "==", userId), where("status", "not-in", ["cancelled"]));
  
  const querySnapshot = await getDocs(q);
  const appointments: BookingDetails[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BookingDetails[];

  console.log(appointments);
  return appointments;
  
};

export const getPastAppointments = async (userId: string): Promise<BookingDetails[]> => {
  const appointmentsRef = collection(db, "bookings");
  
  //  Query to fetch only past appointments with status "confirmed" or "canceled"
  const q = query(appointmentsRef, where("userId", "==", userId), where("status", "in", ["confirmed", "canceled"]));
  
  const querySnapshot = await getDocs(q);
  const appointments: BookingDetails[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BookingDetails[];
   return appointments;
 ;
}

export const getServices = async (): Promise<Service[]> => {
  const servicesCollection = collection(db, 'Services');
  const servicesSnapshot = await getDocs(servicesCollection);
  const services: Service[] = [];
  
  servicesSnapshot.forEach((doc) => {
    services.push({
      serviceId: doc.id,
      ...doc.data(),
    } as Service);
  });

  return services;
};