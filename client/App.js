import React, { useEffect, useState } from 'react';
import { Routes, Route, Switch, BrowserRouter } from 'react-router-dom';
import MainDash from './pages/MainDash';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserContext } from './utils/store';
import './css/app.css';

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <ProtectedRoute user={user} setUser={setUser}>
            <MainDash user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />
      <Route exact path="/login" element={<LoginPage />} />
    </Routes>
  );
}
