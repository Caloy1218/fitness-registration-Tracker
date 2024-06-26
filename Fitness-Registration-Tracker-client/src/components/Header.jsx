import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Divider,
  IconButton,
  useMediaQuery,
  ListItemIcon,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ListAltIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import './Header.css'; // Import CSS file for styling

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const MiniDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : 0,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxSizing: 'border-box',
  ...(open && {
    width: drawerWidth,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      backgroundColor: '#f5f5f5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  }),
  ...(!open && {
    '& .MuiDrawer-paper': {
      width: 0,
    },
  }),
}));

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="header">
      <CssBaseline />
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 2, color: 'black' }}
          >
            <MenuIcon />
          </IconButton>
          <MiniDrawer variant="temporary" open={open} onClose={handleDrawerClose}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose} sx={{ color: 'black' }}>
                <CloseIcon />
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem button component={Link} to="/" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/members" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Members" />
              </ListItem>
              <ListItem button component={Link} to="/register" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
              <ListItem button component={Link} to="/qr-scanner" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <QrCodeScannerIcon />
                </ListItemIcon>
                <ListItemText primary="QR Scanner" />
              </ListItem>
              <ListItem button component={Link} to="/logs" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Logs" />
              </ListItem>
            </List>
          </MiniDrawer>
        </>
      ) : (
        <nav className="nav-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/members">Members</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/qr-scanner">QR Scanner</Link></li>
            <li><Link to="/logs">Logs</Link></li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;
