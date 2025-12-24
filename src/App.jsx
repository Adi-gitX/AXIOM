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
import Posts from './pages/Posts';
import Docs from './pages/Docs';
import Pricing from './pages/Pricing';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* App Routes (Protected-ish) */}
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="education" element={<Education />} />
                    <Route path="dsa" element={<DSATracker />} />
                    <Route path="interview" element={<InterviewPrep />} />
                    <Route path="connect" element={<DeveloperConnect />} />
                    <Route path="jobs" element={<Jobs />} />
                    <Route path="posts" element={<Posts />} />

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
