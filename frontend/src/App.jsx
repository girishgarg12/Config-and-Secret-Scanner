import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ScanHistory from './components/ScanHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<ScanHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
