import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import MainDash from '../pages/MainDash';
import Login from '../pages/LoginPage';
import Loading from '../pages/Loading';

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  //   const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8080/user/verify').then((response) => {
      response.ok ? setAuth(true) : setAuth(false);
      response.json();
    });
  }, []);
  //   if (!loggedIn) return null;

  const success = () => children;
  const failure = () => navigate('/login');
  if (auth === null) return <Loading />;
  return auth ? children : <Navigate to="/login" replace={true} />;
  //   return auth ? <MainDash /> : <Login />;
};

export default ProtectedRoute;
