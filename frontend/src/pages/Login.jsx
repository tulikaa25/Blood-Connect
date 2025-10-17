import React, { useState } from 'react';
import axios from '../utils/axiosConfig';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { phone, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    const body = { phone, password };

    try {
      setLoading(true);
      const res = await axios.post('/auth/login', body); // centralized axios handles baseURL & headers
      console.log('Login successful:', res.data);

      // Optional callback for parent component to handle login state
      if (onLoginSuccess) onLoginSuccess(res.data);

      setLoading(false);
      setFormData({ phone: '', password: '' });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <p>Sign into Your Account</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit}>
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

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
