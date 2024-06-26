import React, { useState, useCallback } from 'react';
import { QrReader } from 'react-qr-reader';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, useMediaQuery, useTheme } from '@mui/material';
import './QrScanner.css'; // Import CSS file

const QrScanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [result, setResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const processScan = async (data) => {
    if (data && data !== lastScanned && !isProcessingScan) {
      setIsProcessingScan(true);
      setLastScanned(data);
      setResult(data);
      setIsCameraActive(false);

      const [fullName, membershipOption] = data.split('-');

      try {
        const q = query(collection(db, 'logs'), where('fullName', '==', fullName), where('timeOut', '==', null));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const logDoc = querySnapshot.docs[0];
          await updateDoc(logDoc.ref, {
            timeOut: Timestamp.now(),
          });
          setDialogMessage(`${fullName} timed out successfully!`);
        } else {
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

  const handleScan = (data) => {
    if (data) {
      debouncedProcessScan(data);
    }
  };

  const handleError = (err) => {
    console.error("QR scanning issue:", err);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const startScanner = () => {
    setResult('');
    setIsCameraActive(true);
  };

  return (
    <div className="qr-scanner-container">
      <Typography variant="h4" gutterBottom align="center">QR Code Scanner</Typography>
      <Button variant="contained" color="primary" onClick={startScanner} disabled={isCameraActive}>
        Start Scanning
      </Button>
      {isCameraActive && (
        <Box className="qr-reader-wrapper">
          <QrReader
            delay={100}
            onError={handleError}
            onScan={handleScan}
            style={{ width: isMobile ? '100%' : '50%' }}
            facingMode="environment"
          />
          {isProcessingScan && (
            <Box className="loading-overlay">
              <CircularProgress size={50} />
            </Box>
          )}
        </Box>
      )}
      {result && (
        <Typography variant="body1" align="center" className="scanned-result">
          Scanned: {result}
        </Typography>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Scan Result</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QrScanner;
