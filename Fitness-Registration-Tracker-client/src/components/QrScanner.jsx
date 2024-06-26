import React, { useState, useCallback } from 'react';
import { QrReader } from 'react-qr-reader';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import './QrScanner.css'; // Import CSS file

const QrScanner = () => {
  const [result, setResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false); // New state to prevent multiple scans
  const [lastScanned, setLastScanned] = useState(''); // New state to store last scanned data
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const processScan = async (data) => {
    if (data && data !== lastScanned && !isProcessingScan) {
      setIsProcessingScan(true);
      setLastScanned(data);
      console.log("QR Code data:", data);
      setResult(data);
      setIsCameraActive(false);

      const [fullName, membershipOption] = data.split('-');

      try {
        // Check if the user is already timed in
        const q = query(collection(db, 'logs'), where('fullName', '==', fullName), where('timeOut', '==', null));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Update the existing document with timeOut
          const logDoc = querySnapshot.docs[0];
          await updateDoc(logDoc.ref, {
            timeOut: Timestamp.now(),
          });
          setDialogMessage(`${fullName} timed out successfully!`);
        } else {
          // Create a new log entry with timeIn
          await addDoc(collection(db, 'logs'), {
            fullName,
            membershipOption,
            timeIn: Timestamp.now(),
            timeOut: null,
          });
          setDialogMessage(`${fullName} timed in successfully!`);
        }

        setDialogOpen(true);
      } catch (error) {
        console.error("Error processing QR code.", error);
        alert('Error processing QR code.');
      }

      setTimeout(() => {
        setIsProcessingScan(false);
        setLastScanned('');
      }, 2000);
    }
  };

  const debouncedProcessScan = useCallback(debounce(processScan, 2000), [lastScanned, isProcessingScan]);

  const handleScan = (result) => {
    if (result?.text) {
      debouncedProcessScan(result.text);
    }
  };

  const handleError = (err) => {
    if (err.name !== 'NotFoundException') { // Suppress specific errors if needed
      console.error("QR scanning issue, please try again.", err);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="qr-scanner-container">
      <h2>QR Code Scanner</h2>
      <button onClick={() => setIsCameraActive(true)}>Start Scanning</button>
      {isCameraActive && (
        <div className="qr-reader-wrapper">
          <QrReader
            delay={100}
            onResult={(result, error) => {
              if (result) {
                handleScan(result);
              }
              if (error) {
                handleError(error);
              }
            }}
            constraints={{
              facingMode: 'environment'
            }}
            style={{ width: '50%' }} // Ensure the video element has a defined size
          />
        </div>
      )}
      {result && <p>Scanned: {result}</p>}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Scan Result</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QrScanner;
