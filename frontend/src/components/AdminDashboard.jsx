import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('/api/appointments/all');
        setAppointments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCheckIn = async (id) => {
    try {
      await axios.post(`/api/appointments/${id}/checkin`);
      setMessage('Donor checked in successfully.');
      // Refresh appointments
      const res = await axios.get('/api/appointments/all');
      setAppointments(res.data);
    } catch (err) {
      setMessage('Error checking in donor.');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/appointments/${id}/status`, { status });
      setMessage(`Appointment status updated to ${status}.`);
      // Refresh appointments
      const res = await axios.get('/api/appointments/all');
      setAppointments(res.data);
    } catch (err) {
      setMessage('Error updating appointment status.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Donor</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt._id}>
              <td>{apt.donorId.name}</td>
              <td>{apt.slotTime}</td>
              <td>{apt.status}</td>
              <td>
                {apt.status === 'booked' && (
                  <button onClick={() => handleCheckIn(apt._id)}>Check-in</button>
                )}
                {apt.status === 'checked-in' && (
                  <button onClick={() => handleStatusUpdate(apt._id, 'donating')}>
                    Start Donation
                  </button>
                )}
                {apt.status === 'donating' && (
                  <button onClick={() => handleStatusUpdate(apt._id, 'completed')}>
                    Finish Donation
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
