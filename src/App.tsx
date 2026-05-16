import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NutritionTracker from './pages/NutritionTracker';
import GoalPlanner from './pages/GoalPlanner';
import DietRecommendation from './pages/DietRecommendation';
import ProgressPhotos from './pages/ProgressPhotos';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import { motion, AnimatePresence } from 'motion/react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="pt-24 pb-12 px-4 max-w-7xl mx-auto"
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>
                } />
                <Route path="/tracker" element={
                  <ProtectedRoute><PageWrapper><NutritionTracker /></PageWrapper></ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute><PageWrapper><GoalPlanner /></PageWrapper></ProtectedRoute>
                } />
                <Route path="/ai-diet" element={
                  <ProtectedRoute><PageWrapper><DietRecommendation /></PageWrapper></ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute><PageWrapper><ProgressPhotos /></PageWrapper></ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute><PageWrapper><Analytics /></PageWrapper></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
