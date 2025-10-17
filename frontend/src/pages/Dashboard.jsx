import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import AppointmentForm from './AppointmentForm';
import ScreeningForm from './ScreeningForm';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to load appointments');
    }
  };

  const fetchUserData = async () => {
    try {
      const userRes = await axios.get('/auth/me');
      setUser(userRes.data);

      await fetchAppointments();
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      {error && <p className="error">{error}</p>}

      <h2>My Appointments</h2>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((apt) => (
            <li key={apt._id}>
              {new Date(apt.slotDate).toLocaleDateString()} at {apt.slotTime} - Status: {apt.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no appointments.</p>
      )}

      <h2>Book an Appointment</h2>
      {user && user.eligibilityStatus === 'eligible' ? (
        <AppointmentForm onBookingSuccess={fetchAppointments} />
      ) : user && user.eligibilityStatus === 'pending_screening' ? (
        <div>
          <p>You must complete the screening form before you can book an appointment.</p>
          <ScreeningForm />
        </div>
      ) : (
        <p>
          You are not currently eligible to donate. Your next eligible date is{' '}
          {user && new Date(user.nextEligibleDate).toLocaleDateString()}.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
