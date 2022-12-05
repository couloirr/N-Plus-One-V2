import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import MainDash from '../pages/MainDash';
import Login from '../pages/LoginPage';
import Loading from '../pages/Loading';

const ProtectedRoute = ({ children, user, setUser }) => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8080/user/verify')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
          setAuth(true);
        } else {
          setAuth(false);
        }
      });
  }, []);

  if (auth === null) return <Loading />;
  // return auth ? children : <Navigate to="/login" replace={true} />;
  return auth ? children : null;
};

export default ProtectedRoute;
