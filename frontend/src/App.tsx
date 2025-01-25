import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AnimatedRoutes } from './components/transitions/AnimatedRoutes';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <Sidebar />
                  <Header />
                  <main className="lg:ml-64 pt-16">
                    <div className="p-4 lg:p-6">
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