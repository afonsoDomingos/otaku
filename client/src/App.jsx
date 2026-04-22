import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeDetails from './pages/AnimeDetails';
import MyPurchases from './pages/MyPurchases';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Player from './pages/Player';
import Mangas from './pages/Mangas';
import MangaDetails from './pages/MangaDetails';
import MangaReader from './pages/MangaReader';
import PodcastSchedule from './pages/PodcastSchedule';
import { SearchProvider } from './context/SearchContext';
import ScrollToTop from './components/ScrollToTop';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
    return children;
};

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mangas" element={<Mangas />} />
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/manga-reader/:mangaId/:chapterIndex" element={<ProtectedRoute><MangaReader /></ProtectedRoute>} />
            <Route path="/podcast-agenda" element={<ProtectedRoute><PodcastSchedule /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
            <Route path="/player/:animeId/:seasonIndex/:episodeIndex" element={<ProtectedRoute><Player /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
