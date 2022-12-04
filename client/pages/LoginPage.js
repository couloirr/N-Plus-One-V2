import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate();
  function handleLogin(e) {
    e.preventDefault();
    console.log(e.target.email.value);
    console.log(e.target.password.value);
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      // .then((data) => data.json())
      .then((response) => {
        response.ok ? navigate('/') : alert('invalid login');
      });
  }
  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="email" name="email"></input>
        <input type="text" placeholder="password" name="password"></input>
        <input type="submit"></input>
      </form>
      <button>Signup</button>
    </div>
  );
}
