import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ProblemDetailPage from './Pages/ProblemDetailPage';
import ProblemsPage from './Pages/ProblemsPage';
import './App.css';
import OAuthCallback from './Pages/OAuthCallback';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:id" element={<ProblemDetailPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
      </Routes>
    </div>
  );
}

export default App;