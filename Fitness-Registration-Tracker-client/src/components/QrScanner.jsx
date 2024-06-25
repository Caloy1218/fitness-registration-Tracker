import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './QrScanner.css'; // Import CSS file

const QrScanner = () => {
  const [result, setResult] = useState('');
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    // Check and request camera permissions
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Do nothing, just requesting permissions
      })
      .catch((err) => {
        setCameraError('Error accessing camera. Please check camera permissions and try again.');
      });
  }, []);

  const handleScan = async (data) => {
    if (data) {
      setResult(data);
      const [fullName, membershipOption] = data.split('-');

      await addDoc(collection(db, 'logs'), {
        fullName,
        membershipOption,
        timestamp: Timestamp.now(),
      });
      alert('QR Code scanned and log added successfully!');
    }
  };

  const handleError = (err) => {
    console.error(err);
    setCameraError('Error accessing camera. Please check camera permissions and try again.');
  };

  return (
    <div className="qr-scanner-container">
      <h2>QR Code Scanner</h2>
      {cameraError && <p className="error-message">{cameraError}</p>}
      <div className="qr-reader-wrapper">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result?.text);
            }
            if (!!error) {
              handleError(error);
            }
          }}
          constraints={{
            facingMode: 'environment'
          }}
        />
      </div>
      {result && <p>Scanned: {result}</p>}
    </div>
  );
};

export default QrScanner;
