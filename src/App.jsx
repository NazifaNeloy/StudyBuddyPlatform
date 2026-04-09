import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { FocusProvider } from './context/FocusContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FocusOrb from './pages/FocusOrb';
import Library from './pages/Library';
import Scanner from './pages/Scanner';
import Circles from './pages/Circles';
import CircleSelection from './pages/CircleSelection';
import SoloFocus from './pages/SoloFocus';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Leaderboard from './pages/Leaderboard';
import PartnerChat from './pages/PartnerChat';
import Notifications from './pages/Notifications';


import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <FocusProvider>
        <Toaster position="top-right" />
        <Router>
          <ErrorBoundary>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <PartnerChat />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/circles" 
              element={
                <ProtectedRoute>
                  <Circles />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/focus" 
              element={
                <ProtectedRoute>
                  <CircleSelection />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/library" 
              element={
                <ProtectedRoute>
                  <CircleSelection />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/focus/:circleId" 
              element={
                <ProtectedRoute>
                  <FocusOrb />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/focus/solo" 
              element={
                <ProtectedRoute>
                  <SoloFocus />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/library/:circleId" 
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/scanner" 
              element={
                <ProtectedRoute>
                  <Scanner />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </Router>
      </FocusProvider>
    </AuthProvider>
  );
}

export default App;
