import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function MainDash() {
  const navigate = useNavigate;
  return (
    <div className="mainDash">
      <div className="navbar">
        <h1> Main Dash</h1>
        <button onClick={() => navigate()}>Login</button>
        <form action="http://localhost:3000/auth/strava" method="get">
          <input
            type="image"
            value="Log"
            src="../assets/btn_strava_connectwith_orange@2x.png"
          ></input>
        </form>
      </div>
    </div>
  );
}
