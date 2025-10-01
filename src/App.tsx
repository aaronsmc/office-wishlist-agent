import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { WishlistProvider } from './components/WishlistContext';
import { WishlistChat } from './components/WishlistChat';
import { Dashboard } from './pages/Dashboard';
export function App() {
  return <BrowserRouter>
      <ThemeProvider>
        <WishlistProvider>
          <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<WishlistChat />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </WishlistProvider>
      </ThemeProvider>
    </BrowserRouter>;
}