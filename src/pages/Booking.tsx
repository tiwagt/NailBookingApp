import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Calendar } from '../components/Calendar/Calendar';
import { TimeSlotPicker } from '../components/TimeSlots/TimeSlotPicker';
import { BookingDetails } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../hooks/useServices';
import toast from 'react-hot-toast';
import { saveBooking, getBookedTimeSlots } from '../services/bookings'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; 

export function Booking() {
  const [searchParams] = useSearchParams();
  const selectedServiceId = searchParams.get('service');
  const { currentUser } = useAuth();
  const { services, loading } = useServices();
  const location = useLocation();
  const { date, time, service } = location.state || {}; // Destructure the state
  const [userData, setUserData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    service: selectedServiceId || '',
    date: date || '',
    time: time || '',
    name: '',
    email: currentUser?.email || '',
    phone:  ''
  });
  
  // State to track booked time slots
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookedTimeSlots = async () => {
      const fetchedBookedSlots = await getBookedTimeSlots(selectedDate); // Fetch booked slots for the selected date
      setBookedTimeSlots(fetchedBookedSlots);
    };

    fetchBookedTimeSlots();
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    const newBooking: BookingDetails = {
      service: bookingDetails.service,
      date: selectedDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time: selectedTime,
      name: bookingDetails.name,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      userId: currentUser?.uid, // Ensure userId is included
      status: 'pending', // Default status
      createdAt: new Date() // Current timestamp
    };

    try {
      await saveBooking(newBooking); // Call the function to save booking data
      toast.success('Booking submitted successfully!');
      // Update booked time slots
      setBookedTimeSlots((prev) => [...prev, selectedTime!]);
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  const isTimeBooked = (time: string) => bookedTimeSlots.includes(time);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Book Your Appointment</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              bookedTimeSlots={bookedTimeSlots} // Pass booked time slots
              isTimeBooked={isTimeBooked} // Function to check if time is booked
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                  value={bookingDetails.service}
                  onChange={(e) => setBookingDetails({...bookingDetails, service: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.serviceId} value={service.serviceId}>
                      {service.name} (${service.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={bookingDetails.name}
                  onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={bookingDetails.phone}
                  onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}