import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Shield, Lock, EyeOff } from 'lucide-react';
import Landing from './pages/Landing';
import SubmitReport from './pages/SubmitReport';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-gray-200 font-inter">
        <nav className="p-4 border-b border-surface flex justify-between items-center bg-surface/50 backdrop-blur-md sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white hover:text-primary transition-colors">
            <EyeOff className="w-6 h-6 text-primary" />
            <span>ShadowDrop</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/submit" className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all font-medium text-sm">
              Submit Report
            </Link>
            <Link to="/admin" className="px-4 py-2 hover:text-white transition-colors text-sm flex items-center gap-1">
              <Lock className="w-4 h-4" /> Admin
            </Link>
          </div>
        </nav>

        <main className="container mx-auto p-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/submit" element={<SubmitReport />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<AdminLogin />} />
          </Routes>
        </main>

        <footer className="text-center p-8 text-gray-600 text-sm border-t border-surface mt-12">
          <p>© 2026 ShadowDrop. Secure. Anonymous. Untraceable.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
