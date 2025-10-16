import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';
import ScreeningForm from './ScreeningForm';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/auth/me');
        setUser(userRes.data);

        const appointmentsRes = await axios.get('/api/appointments/my');
        setAppointments(appointmentsRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
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
        <AppointmentForm />
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
