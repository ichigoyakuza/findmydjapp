import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthorizationProvider } from './contexts/AuthorizationContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { SocialProvider } from './contexts/SocialContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import DJProfile from './pages/DJProfile';
import Discovery from './pages/Discovery';
import BookingForm from './pages/BookingForm';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import Artists from './pages/Artists';
import DJMapPage from './pages/DJMapPage';
import CommunityPage from './pages/CommunityPage';
import { MusicStore } from './pages/MusicStore';
import MusicHub from './pages/MusicHub';
import Subscription from './pages/Subscription';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import Forum from './pages/Forum';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Messages from './pages/Messages';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthorizationProvider>
          <SubscriptionProvider>
            <MarketplaceProvider>
              <SocialProvider>
              <Router>
              <div className="min-h-screen bg-dark-950 mobile-content">
                <Navigation />
                <main className="pb-20 md:pb-0">
                  <Routes>
                    <Route path="/" element={<Discovery />} />
                    <Route path="/map" element={<DJMapPage />} />
                    <Route path="/community" element={<Discovery />} />
                    <Route path="/dj/:id" element={<DJProfile />} />
                    <Route path="/book/:id" element={<BookingForm />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/artists" element={<Artists />} />
                    <Route path="/forum" element={<Forum />} />
            <Route path="/forum/create" element={<CreatePost />} />
            <Route path="/forum/:id" element={<PostDetail />} />
                    <Route path="/messages" element={
                      <ProtectedRoute requireAuth={true} showFallback={true}>
                        <Messages />
                      </ProtectedRoute>
                    } />
                    <Route path="/music-store" element={<MusicStore />} />
                    <Route path="/music-hub" element={
                      <ProtectedRoute requireAuth={true} showFallback={true}>
                        <MusicHub />
                      </ProtectedRoute>
                    } />
                    <Route path="/subscription" element={
                      <ProtectedRoute requireAuth={true} showFallback={true}>
                        <Subscription />
                      </ProtectedRoute>
                    } />
                    <Route path="/subscription/success" element={
                      <ProtectedRoute requireAuth={true} showFallback={true}>
                        <SubscriptionSuccess />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute requireAuth={true} requireRole="dj" showFallback={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
              </div>
              </Router>
              </SocialProvider>
            </MarketplaceProvider>
          </SubscriptionProvider>
        </AuthorizationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;