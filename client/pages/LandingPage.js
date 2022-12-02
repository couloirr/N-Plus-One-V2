import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Landing Page</h1>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
}
