import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import './Logs.css'; // Import CSS file

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [fullName, setFullName] = useState('');
  const [membershipOption, setMembershipOption] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogsByDate(selectedDate);
  }, [logs, selectedDate]);

  const fetchLogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'logs'));
      const logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timeIn: doc.data().timeIn?.toDate().toLocaleString(),
        timeOut: doc.data().timeOut ? doc.data().timeOut.toDate().toLocaleString() : '',
      }));
      setLogs(logsData);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'logs', id));
      fetchLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleEdit = async (log) => {
    setEditingLog(log);
    setFullName(log.fullName);
    setMembershipOption(log.membershipOption);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLog(null);
    setFullName('');
    setMembershipOption('');
  };

  const handleSubmit = async () => {
    try {
      if (editingLog) {
        await updateDoc(doc(db, 'logs', editingLog.id), {
          fullName,
          membershipOption,
          timeOut: Timestamp.now(), // Update timeOut when saving edits
        });
        fetchLogs();
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  const filterLogsByDate = (date) => {
    const filtered = logs.filter(log => dayjs(log.timeIn).isSame(date, 'day'));
    setFilteredLogs(filtered);
  };

  const columns = [
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'membershipOption', headerName: 'Membership Option', flex: 1 },
    { field: 'timeIn', headerName: 'Time In', flex: 1 },
    { field: 'timeOut', headerName: 'Time Out', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="logs-container">
        <h2>Check-in/Check-out Logs</h2>
        <Box mb={2}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            textField={<TextField />}
          />
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredLogs}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Log</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please edit the log details below:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Membership Option"
              type="text"
              fullWidth
              value={membershipOption}
              onChange={(e) => setMembershipOption(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default Logs;
