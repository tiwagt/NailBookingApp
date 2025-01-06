import React from 'react';

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookedTimeSlots: string[];
  isTimeBooked: (time: string) => boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  bookedTimeSlots,
  isTimeBooked,
}) => {
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']; // Example time slots

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>
      <div className="grid grid-cols-3 gap-4">
        {timeSlots.map((time) => (
          <div key={time} className="relative">
            <button
              onClick={() => !isTimeBooked(time) && onTimeSelect(time)}
              className={`w-full py-2 rounded-md ${isTimeBooked(time) ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'} text-white`}
              disabled={isTimeBooked(time)}
              title={isTimeBooked(time) ? 'This time is no longer available' : ''}
            >
              {time}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};