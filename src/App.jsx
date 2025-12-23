import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Education from './pages/Education';
import DSATracker from './pages/DSATracker';
import InterviewPrep from './pages/InterviewPrep';
import DeveloperConnect from './pages/DeveloperConnect';
import Jobs from './pages/Jobs';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<LandingPage />} />

                {/* App Routes (Protected-ish) */}
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="education" element={<Education />} />
                    <Route path="dsa" element={<DSATracker />} />
                    <Route path="interview" element={<InterviewPrep />} />
                    <Route path="connect" element={<DeveloperConnect />} />
                    <Route path="jobs" element={<Jobs />} />
                    
                    {/* Redirect unknown app routes to dashboard */}
                    <Route path="*" element={<Navigate to="/app" replace />} />
                </Route>

                {/* Fallback for root 404s */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
