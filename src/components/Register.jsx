// src/components/Register.js
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './Register.css'; // Import CSS file

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipOption, setMembershipOption] = useState('');
  const [membershipPrice, setMembershipPrice] = useState(0);

  const handleMembershipChange = (e) => {
    const option = e.target.value;
    setMembershipOption(option);

    // Set price based on selected option
    switch (option) {
      case 'Option 1':
        setMembershipPrice(1000);
        break;
      case 'Option 2':
        setMembershipPrice(2500);
        break;
      case 'Option 3':
        setMembershipPrice(8500);
        break;
      default:
        setMembershipPrice(0);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'members'), {
        fullName,
        email, // Include email in the document
        address,
        phoneNumber,
        membershipOption,
        membershipPrice,
      });
      console.log('Document written with ID: ', docRef.id);
      // Clear form inputs after submission
      setFullName('');
      setEmail(''); // Clear email input
      setAddress('');
      setPhoneNumber('');
      setMembershipOption('');
      setMembershipPrice(0);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address" // Add email input field
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <select value={membershipOption} onChange={handleMembershipChange} required>
          <option value="">Select Membership Option</option>
          <option value="Option 1">1 month (PHP 1000)</option>
          <option value="Option 2">3 months (PHP 2500)</option>
          <option value="Option 3">1 year (PHP 8500)</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
