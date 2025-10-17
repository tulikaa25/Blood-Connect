import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me'); // centralized axios
        setUser(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>My Profile</h2>
      {user ? (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Blood Group:</strong> {user.bloodGroup || 'N/A'}
          </p>
          <p>
            <strong>Eligibility Status:</strong> {user.eligibilityStatus}
          </p>
          {user.nextEligibleDate && (
            <p>
              <strong>Next Eligible Date:</strong>{' '}
              {new Date(user.nextEligibleDate).toLocaleDateString()}
            </p>
          )}

          <h3>Donation History</h3>
          {user.donationHistory && user.donationHistory.length > 0 ? (
            <ul>
              {user.donationHistory.map((donation, index) => (
                <li key={index}>
                  {new Date(donation.donationDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No donation history.</p>
          )}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
