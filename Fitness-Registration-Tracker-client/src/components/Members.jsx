import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import QRCodeGenerator from './QrCode';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, IconButton, Paper, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CSVLink } from 'react-csv';

const Members = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [members, setMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [editingMember, setEditingMember] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipOption, setMembershipOption] = useState('');
  const [membershipPrice, setMembershipPrice] = useState(0);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMembers(membersData);
    } catch (error) {
      console.error("Error fetching members: ", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'members', id));
    fetchMembers();
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setName(member.name || '');
    setEmail(member.email || '');
    setFullName(member.fullName || '');
    setAddress(member.address || '');
    setPhoneNumber(member.phoneNumber || '');
    setMembershipOption(member.membershipOption || '');
    setMembershipPrice(member.membershipPrice || 0);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setName('');
    setEmail('');
    setFullName('');
    setAddress('');
    setPhoneNumber('');
    setMembershipOption('');
    setMembershipPrice(0);
    setDialogMode('add');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'add') {
      await addDoc(collection(db, 'members'), {
        name,
        email,
        fullName,
        address,
        phoneNumber,
        membershipOption,
        membershipPrice,
      });
    } else if (dialogMode === 'edit' && editingMember) {
      await updateDoc(doc(db, 'members', editingMember.id), {
        name,
        email,
        fullName,
        address,
        phoneNumber,
        membershipOption,
        membershipPrice,
      });
    }
    setOpenDialog(false);
    fetchMembers();
  };

  const exportToCSV = () => {
    const csvData = members.map(member => ({
      Name: member.fullName,
      Email: member.email,
      Address: member.address,
      'Phone Number': member.phoneNumber,
      'Membership Option': member.membershipOption,
      'Membership Price (PHP)': member.membershipPrice,
    }));
    return csvData;
  };

  const columns = [
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'membershipOption', headerName: 'Membership Option', flex: 1 },
    { field: 'membershipPrice', headerName: 'Membership Price (PHP)', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
          <Grid item>
            <IconButton onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <QRCodeGenerator text={`${params.row.fullName}-${params.row.membershipOption}`} />
          </Grid>
        </Grid>
      )
    }
  ];

  return (
    <div className="members-container">
      <Typography variant="h4" gutterBottom align="center">Members</Typography>
      <Grid container justifyContent="flex-end" alignItems="center" spacing={2} style={{ marginBottom: '10px' }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAdd}>Add Member</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            <CSVLink data={exportToCSV()} filename={"members.csv"} style={{ textDecoration: 'none', color: 'inherit' }}>
              Export CSV
            </CSVLink>
          </Button>
        </Grid>
      </Grid>
      <Paper style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={members}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === 'add' ? 'Add Member' : 'Edit Member'}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Please fill out the form below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Membership Option"
            fullWidth
            value={membershipOption}
            onChange={(e) => setMembershipOption(e.target.value)}
          >
            <MenuItem value="">Select Membership Option</MenuItem>
            <MenuItem value="Option 1">1 month (PHP 1000)</MenuItem>
            <MenuItem value="Option 2">3 months (PHP 2500)</MenuItem>
            <MenuItem value="Option 3">1 year (PHP 8500)</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Membership Price (PHP)"
            type="number"
            fullWidth
            value={membershipPrice}
            onChange={(e) => setMembershipPrice(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Members;
