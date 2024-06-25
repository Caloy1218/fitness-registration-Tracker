import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
    const querySnapshot = await getDocs(collection(db, 'logs'));
    setLogs(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp.toDate() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'logs', id));
    fetchLogs();
  };

  const handleEdit = (log) => {
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
    if (editingLog) {
      await updateDoc(doc(db, 'logs', editingLog.id), {
        fullName,
        membershipOption,
      });
      fetchLogs();
    }
    setOpenDialog(false);
  };

  const filterLogsByDate = (date) => {
    const filtered = logs.filter(log => dayjs(log.timestamp).isSame(date, 'day'));
    setFilteredLogs(filtered);
  };

  const columns = [
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'membershipOption', headerName: 'Membership Option', flex: 1 },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      flex: 1,
      type: 'dateTime',
      valueGetter: (params) => {
        const timestamp = params.value;
        if (timestamp) {
          return new Date(timestamp.seconds * 1000);
        }
        return null;
      },
    },
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
            renderInput={(params) => <TextField {...params} />}
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
