import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Dashboard } from '../../pages/Dashboard';
import { NewSoapNote } from '../../pages/NewSoapNote';
import { History } from '../../pages/History';
import { Analytics } from '../../pages/Analytics';
import { Settings } from '../../pages/Settings';
import { PageTransition } from './PageTransition';

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Dashboard />
          </PageTransition>
        } />
        <Route path="/soap/new" element={
          <PageTransition>
            <NewSoapNote />
          </PageTransition>
        } />
        <Route path="/history" element={
          <PageTransition>
            <History />
          </PageTransition>
        } />
        <Route path="/analytics" element={
          <PageTransition>
            <Analytics />
          </PageTransition>
        } />
        <Route path="/settings" element={
          <PageTransition>
            <Settings />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};