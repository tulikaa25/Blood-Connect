import React, { useState } from 'react';
import axios from 'axios';

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

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    // Logic to submit the form to the backend will be added here
    console.log(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Pre-Booking Eligibility Form</h2>
      
      <h4>Basic Details</h4>
      <input type="text" name="fullName" placeholder="Full Name" onChange={onChange} required />
      <input type="number" name="age" placeholder="Age (18-65)" onChange={onChange} required />
      <select name="gender" onChange={onChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input type="number" name="weight" placeholder="Weight (>= 45 kg)" onChange={onChange} required />
      <input type="text" name="contact" placeholder="Contact Number" onChange={onChange} required />

      <h4>Medical History</h4>
      <label>Have you ever had the following?</label>
      <div><input type="checkbox" name="medicalConditions.hiv" onChange={onChange} /> HIV/AIDS, Hepatitis B/C, Syphilis, Malaria</div>
      <div><input type="checkbox" name="medicalConditions.heartDisease" onChange={onChange} /> Heart disease, uncontrolled hypertension, or diabetes</div>
      <div><input type="checkbox" name="medicalConditions.cancer" onChange={onChange} /> Cancer, epilepsy, bleeding/clotting disorders</div>
      <div><input type="checkbox" name="medicalConditions.tuberculosis" onChange={onChange} /> Tuberculosis (active or past 2 years)</div>
      
      <label>Are you currently taking long-term medications?</label>
      <select name="longTermMedications" onChange={onChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
      {formData.longTermMedications && <textarea name="medicationDetails" placeholder="Please specify" onChange={onChange}></textarea>}

      <label>Have you ever been permanently deferred from donating?</label>
      <select name="permanentlyDeferred" onChange={onChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <h4>Donation History</h4>
      <label>Have you donated blood/plasma before?</label>
      <select name="hasDonatedBefore" onChange={onChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
      {formData.hasDonatedBefore && <input type="date" name="lastDonationDate" onChange={onChange} />}

      <h4>Lifestyle / Recent History</h4>
      <label>Tattoo, piercing, or acupuncture in the last 6 months?</label>
      <select name="tattooOrPiercing" onChange={onChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <label>Vaccination in the last 28 days?</label>
      <select name="vaccination" onChange={onChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <h4>For Women Donors</h4>
      <label>Are you currently pregnant or breastfeeding?</label>
      <select name="isPregnantOrBreastfeeding" onChange={onChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ScreeningForm;
