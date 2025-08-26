import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Items from './Pages/ItemePage'; // fixed import path and filename

const theme = createTheme({
  palette: {
    primary: {
      main: '#06c167', // Uber Eats green
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#f6f6f6',
    },
  },
  typography: {
    fontFamily: 'UberMove, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/home" element={<Items />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
