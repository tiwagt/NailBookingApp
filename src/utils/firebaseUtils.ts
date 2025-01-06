import { db } from '../lib/firebase'; // Adjust the import path as necessary
import { collection, onSnapshot } from "firebase/firestore";
import { BookingDetails } from '../types/index'; // Adjust the import path as necessary

export const listenToAppointments = (callback: (appointments: BookingDetails[]) => void) => {
  const appointmentsRef = collection(db, "bookings");

  const unsubscribe = onSnapshot(appointmentsRef, (snapshot) => {
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as BookingDetails,
    }));
    callback(appointments);
  });

  return unsubscribe; // Return the unsubscribe function
};
  