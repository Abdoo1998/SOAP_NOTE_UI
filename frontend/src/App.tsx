import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AnimatedRoutes } from './components/transitions/AnimatedRoutes';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <Sidebar />
                  <Header />
                  <main className="ml-64 pt-16">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                      <AnimatedRoutes />
                    </div>
                  </main>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}