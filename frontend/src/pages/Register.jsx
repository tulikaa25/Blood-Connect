import React, { useState } from 'react';
import axios from '../utils/axiosConfig';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, phone, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !password || !password2) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    const newUser = { name, phone, password };

    try {
      setLoading(true);
      const res = await axios.post('/auth/register', newUser); // centralized axios
      console.log('Registration successful:', res.data);

      if (onRegisterSuccess) onRegisterSuccess(res.data);

      setLoading(false);
      setFormData({ name: '', phone: '', password: '', password2: '' });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <p>Create Your Account</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={phone}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
