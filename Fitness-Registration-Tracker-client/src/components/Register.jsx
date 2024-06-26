import React, { useState } from 'react';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import './Register.css'; // Import CSS file

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipOption, setMembershipOption] = useState('');
  const [membershipPrice, setMembershipPrice] = useState(0);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog

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
      console.log('Submitting registration...');
      await addDoc(collection(db, 'members'), {
        fullName,
        email,
        address,
        phoneNumber,
        membershipOption,
        membershipPrice,
      });
  
      console.log('Data added to Firestore.');
  
      console.log('Sending registration data to server...');
      await axios.post('http://localhost:5000/register', {
        fullName,
        email,
        address,
        phoneNumber,
        membershipOption,
        membershipPrice,
      });
  
      console.log('Registration request sent.');
  
      setOpenDialog(true); // Open dialog on successful registration
  
      // Clear form inputs after submission
      setFullName('');
      setEmail('');
      setAddress('');
      setPhoneNumber('');
      setMembershipOption('');
      setMembershipPrice(0);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user.');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog
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
          placeholder="Email Address"
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

        {/* Dialog for successful registration */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Registration Successful!</DialogTitle>
          <DialogContent>
            <p>Your registration was successful. An email has been sent.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default Register;
