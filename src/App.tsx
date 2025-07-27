import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { BookOpen, GamepadIcon, FlaskRound as Flask, Shield, Mailbox as Toolbox, Users, ExternalLink } from 'lucide-react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Journey from './pages/Journey';
<<<<<<< HEAD
import SimulationLab from './pages/SimulationLab';

=======
>>>>>>> aa0f564624a832de72db03b6b63f012c5d5f5e1f
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
