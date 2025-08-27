import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Items from './Pages/ItemePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/ggtest" element={<Items />} />
      </Routes>
    </Router>
  );
}

export default App;
