import React from 'react';
import AppointmentForm from './AppointmentForm';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>My Appointments</h2>
      {/* Appointments will be listed here */}
      <h2>Book an Appointment</h2>
      <AppointmentForm />
    </div>
  );
};

export default Dashboard;
