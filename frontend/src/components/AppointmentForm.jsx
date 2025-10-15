import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentForm = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('/api/appointments/slots');
        setSlots(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };

    fetchSlots();
  }, []);

  const onChange = (e) => setSelectedSlot(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const [slotDate, slotTime] = selectedSlot.split('|');
    const newAppointment = {
      slotDate,
      slotTime,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(newAppointment);

      const res = await axios.post('/api/appointments/book', body, config);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div>
        <select
          name="slot"
          value={selectedSlot}
          onChange={(e) => onChange(e)}
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
      <input type="submit" value="Book Appointment" />
    </form>
  );
};

export default AppointmentForm;
