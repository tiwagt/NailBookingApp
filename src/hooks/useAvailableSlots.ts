import { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { getAvailableTimeSlots } from '../services/bookings';

export function useAvailableSlots(date: Date | null) {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available dates for the month
  useEffect(() => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const currentDate = addDays(new Date(), i);
      // Exclude Sundays
      return currentDate.getDay() !== 0 ? currentDate : null;
    }).filter(Boolean) as Date[];

    setAvailableDates(dates);
  }, [date]);

  // Get available time slots for the selected date
  useEffect(() => {
    async function fetchTimeSlots() {
      try {
        setLoading(true);
        setError(null);
        const slots = await getAvailableTimeSlots(date!);
        setAvailableSlots(slots);
      } catch (err) {
        setError('Failed to load available time slots');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (date) {
      fetchTimeSlots();
    }
  }, [date]);

  return { availableDates, availableSlots, loading, error };
}