import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const AppointmentForm = ({ onBookingSuccess }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('/appointments/slots');
        setSlots(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Unable to load slots');
      }
    };

    fetchSlots();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const [slotDate, slotTime] = selectedSlot.split('|');
    const newAppointment = { slotDate, slotTime };

    try {
      setLoading(true);
      await axios.post('/appointments/book', newAppointment);
      alert('Appointment booked successfully!');
      setSelectedSlot('');
      setError('');
      setLoading(false);

      // Refresh appointments in parent
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to book appointment');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p className="error">{error}</p>}

      <div>
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a slot
          </option>
          {slots.map((day) =>
            day.times.map((time) => (
              <option key={`${day.date}|${time}`} value={`${day.date}|${time}`}>
                {new Date(day.date).toLocaleDateString()} at {time}
              </option>
            ))
          )}
        </select>
      </div>

      <button type="submit" disabled={loading || !selectedSlot}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;
