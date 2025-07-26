import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { BookOpen, GamepadIcon, FlaskRound as Flask, Shield, Mailbox as Toolbox, Users, ExternalLink } from 'lucide-react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Journey from './pages/Journey';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Journey />} />
    </Routes>
  );
}

export default App;
