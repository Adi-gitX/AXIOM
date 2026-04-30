import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import RouteLoader from './components/RouteLoader';

import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Education = lazy(() => import('./pages/Education'));
const DSATracker = lazy(() => import('./pages/DSATracker'));
const DSASheetPage = lazy(() => import('./pages/DSASheetPage'));
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'));
const DeveloperConnect = lazy(() => import('./pages/DeveloperConnect'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Posts = lazy(() => import('./pages/Posts'));
const OssContributionEngine = lazy(() => import('./pages/OssContributionEngine'));
const GsocAccelerator = lazy(() => import('./pages/GsocAccelerator'));
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio'));
const Docs = lazy(() => import('./pages/Docs'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Companies = lazy(() => import('./pages/Companies'));
const CompanyDetail = lazy(() => import('./pages/CompanyDetail'));
const InterviewExperiences = lazy(() => import('./pages/InterviewExperiences'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Suspense fallback={<RouteLoader />}>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/docs" element={<Docs />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/u/:username" element={<PublicPortfolio />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/terms" element={<Terms />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* App Routes (Protected) */}
                            <Route path="/app" element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Dashboard />} />
                                <Route path="education" element={<Education />} />
                                <Route path="dsa" element={<DSATracker />} />
                                <Route path="dsa/companies" element={<Companies />} />
                                <Route path="dsa/companies/:slug" element={<CompanyDetail />} />
                                <Route path="dsa/:sheetId" element={<DSASheetPage />} />
                                <Route path="interview" element={<InterviewPrep />} />
                                <Route path="interviews" element={<InterviewExperiences />} />
                                <Route path="connect" element={<DeveloperConnect />} />
                                <Route path="oss" element={<OssContributionEngine />} />
                                <Route path="gsoc" element={<GsocAccelerator />} />
                                <Route path="jobs" element={<Jobs />} />
                                <Route path="posts" element={<Posts />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="settings" element={<Settings />} />

                                {/* Redirect unknown app routes to dashboard */}
                                <Route path="*" element={<Navigate to="/app" replace />} />
                            </Route>

                            {/* Public 404 — branded, not a hard redirect */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </Suspense>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
