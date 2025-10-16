import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; // ✅ Use centralized axios config

const AppointmentForm = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Optional UI improvement
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('/appointments/slots'); // ✅ No need for /api if baseURL is set
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
    const [slotDate, slotTime] = selectedSlot.split('|');
    const newAppointment = { slotDate, slotTime };

    try {
      setLoading(true);
      const res = await axios.post('/appointments/book', newAppointment);
      alert('Appointment booked successfully!');
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to book appointment');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} required>
          <option value="" disabled>Select a slot</option>
          {slots.map((day) =>
            day.times.map((time) => (
              <option key={`${day.date}|${time}`} value={`${day.date}|${time}`}>
                {new Date(day.date).toLocaleDateString()} at {time}
              </option>
            ))
          )}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;
