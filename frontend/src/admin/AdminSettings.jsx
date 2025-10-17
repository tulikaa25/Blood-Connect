import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';


const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const onChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios.put('/api/settings', settings, config);
      setMessage('Settings updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Error updating settings.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Admin Settings</h2>
      {message && <p>{message}</p>}
      {settings && (
        <form onSubmit={onSubmit}>
          <div>
            <label>Total Beds</label>
            <input
              type="number"
              name="totalBeds"
              value={settings.totalBeds}
              onChange={onChange}
            />
          </div>
          <div>
            <label>Buffer Beds</label>
            <input
              type="number"
              name="bufferBeds"
              value={settings.bufferBeds}
              onChange={onChange}
            />
          </div>
          <div>
            <label>Slot Duration (minutes)</label>
            <input
              type="number"
              name="slotDurationMinutes"
              value={settings.slotDurationMinutes}
              onChange={onChange}
            />
          </div>
          <div>
            <label>Time Gap (minutes)</label>
            <input
              type="number"
              name="timeGapMinutes"
              value={settings.timeGapMinutes}
              onChange={onChange}
            />
          </div>
          <div>
            <label>Grace Period (minutes)</label>
            <input
              type="number"
              name="gracePeriodMinutes"
              value={settings.gracePeriodMinutes}
              onChange={onChange}
            />
          </div>
          <div>
            <label>Opening Time</label>
            <input
              type="text"
              name="openingTime"
              value={settings.openingTime}
              onChange={onChange}
            />
          </div>
          <div>
            <label>Closing Time</label>
            <input
              type="text"
              name="closingTime"
              value={settings.closingTime}
              onChange={onChange}
            />
          </div>
          <button type="submit">Save Settings</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
