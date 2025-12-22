import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Placeholder imports for pages
import Education from './pages/Education';
import DSATracker from './pages/DSATracker';
import InterviewPrep from './pages/InterviewPrep';
import DeveloperConnect from './pages/DeveloperConnect';
import Jobs from './pages/Jobs';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Education />} />
                    <Route path="dsa" element={<DSATracker />} />
                    <Route path="interview" element={<InterviewPrep />} />
                    <Route path="connect" element={<DeveloperConnect />} />
                    <Route path="jobs" element={<Jobs />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
