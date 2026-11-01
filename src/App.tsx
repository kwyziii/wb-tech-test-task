import React from 'react';
import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline, Box } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { UsersListPage } from './pages/UsersListPage';
import { UserDetailsPage } from './pages/UserDetailsPage';

export const App: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <PeopleAltIcon sx={{ mr: 1.5 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              WB-Tech Users Admin
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Routes>
        <Route path="/" element={<UsersListPage />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

export default App;