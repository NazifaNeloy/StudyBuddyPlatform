import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FocusOrb from './pages/FocusOrb';
import Library from './pages/Library';
import Scanner from './pages/Scanner';
import LandingPage from './pages/LandingPage';

// Temporary placeholders for other routes
const Placeholder = ({ title }) => (
  <Layout>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4 italic tracking-tight italic">{title}</h1>
      <p className="text-gray-500 max-w-md">
        This portal is currently being materialized. Stay tuned for Phase 3 and 4!
      </p>
    </div>
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/circles" 
            element={
              <ProtectedRoute>
                <Placeholder title="Study Circles" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/focus" 
            element={
              <ProtectedRoute>
                <Layout>
                  <FocusOrb />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Library />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Scanner />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
