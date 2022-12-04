import React, { useEffect, useState } from 'react';
import { Routes, Route, Switch, BrowserRouter } from 'react-router-dom';
import MainDash from './pages/MainDash';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './css/app.css';

export default function App() {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <ProtectedRoute>
            <MainDash />
          </ProtectedRoute>
        }
      />
      <Route exact path="/login" element={<LoginPage />} />
    </Routes>
  );
}
