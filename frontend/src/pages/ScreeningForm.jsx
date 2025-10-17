import React, { useState } from 'react';
import axios from '../utils/axiosConfig';

const ScreeningForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    weight: '',
    contact: '',
    medicalConditions: {
      hiv: false,
      hepatitis: false,
      syphilis: false,
      malaria: false,
      heartDisease: false,
      cancer: false,
      epilepsy: false,
      tuberculosis: false,
    },
    longTermMedications: false,
    medicationDetails: '',
    permanentlyDeferred: false,
    hasDonatedBefore: false,
    lastDonationDate: '',
    tattooOrPiercing: false,
    vaccination: false,
    isPregnantOrBreastfeeding: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested medicalConditions checkboxes
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: checked },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const res = await axios.post('/screening/submit', formData);
      setMessage(res.data.message || 'Screening submitted successfully');
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to submit screening');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Pre-Booking Eligibility Form</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h4>Basic Details</h4>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        onChange={onChange}
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age (18-65)"
        onChange={onChange}
        required
      />
      <select name="gender" onChange={onChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input
        type="number"
        name="weight"
        placeholder="Weight (>= 45 kg)"
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        onChange={onChange}
        required
      />

      <h4>Medical History</h4>
      <label>Have you ever had the following?</label>
      <div>
        <input type="checkbox" name="medicalConditions.hiv" onChange={onChange} /> HIV/AIDS
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.hepatitis" onChange={onChange} /> Hepatitis B/C
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.syphilis" onChange={onChange} /> Syphilis
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.malaria" onChange={onChange} /> Malaria
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.heartDisease" onChange={onChange} /> Heart Disease
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.cancer" onChange={onChange} /> Cancer
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.epilepsy" onChange={onChange} /> Epilepsy
      </div>
      <div>
        <input type="checkbox" name="medicalConditions.tuberculosis" onChange={onChange} /> Tuberculosis
      </div>

      <label>Currently taking long-term medications?</label>
      <select
        name="longTermMedications"
        onChange={(e) => setFormData({ ...formData, longTermMedications: e.target.value === 'true' })}
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
      {formData.longTermMedications && (
        <textarea
          name="medicationDetails"
          placeholder="Please specify"
          onChange={onChange}
        ></textarea>
      )}

      <label>Permanently deferred from donating before?</label>
      <select
        name="permanentlyDeferred"
        onChange={(e) => setFormData({ ...formData, permanentlyDeferred: e.target.value === 'true' })}
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <h4>Donation History</h4>
      <label>Have you donated before?</label>
      <select
        name="hasDonatedBefore"
        onChange={(e) => setFormData({ ...formData, hasDonatedBefore: e.target.value === 'true' })}
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
      {formData.hasDonatedBefore && (
        <input type="date" name="lastDonationDate" onChange={onChange} />
      )}

      <h4>Lifestyle / Recent History</h4>
      <label>Tattoo/piercing/acupuncture in last 6 months?</label>
      <select
        name="tattooOrPiercing"
        onChange={(e) => setFormData({ ...formData, tattooOrPiercing: e.target.value === 'true' })}
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <label>Vaccination in last 28 days?</label>
      <select
        name="vaccination"
        onChange={(e) => setFormData({ ...formData, vaccination: e.target.value === 'true' })}
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <h4>For Women Donors</h4>
      <label>Pregnant or breastfeeding?</label>
      <select
        name="isPregnantOrBreastfeeding"
        onChange={(e) => setFormData({ ...formData, isPregnantOrBreastfeeding: e.target.value === 'true' })}
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ScreeningForm;
