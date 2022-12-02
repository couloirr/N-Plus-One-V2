import React from 'react';

export default function Login() {
  function handleLogin(e) {
    e.preventDefault();
    console.log(e.target.email.value);
    console.log(e.target.password.value);
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
