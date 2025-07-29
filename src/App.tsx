import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Journey from './pages/Journey';
import SimulationLab from './pages/SimulationLab';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/simulation-lab" element={<SimulationLab />} />
      <Route path="/" element={<Journey />} />
    </Routes>
  );
}

export default App;
