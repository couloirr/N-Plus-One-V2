import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartLI, RideLI } from '../components/ListItems';
export default function MainDash({ user, setUser }) {
  const { bikeData, rides, parts } = user;
  const navigate = useNavigate();
  function handleClick() {
    navigate('/login');
  }

  useEffect(() => {
    console.log(user, 'in user');
  }, []);
  return (
    <div className="mainDash">
      <div className="navbar">
        <h1> Main Dash</h1>
        <button onClick={() => navigate('/login')}>Login</button>
        <form action="http://localhost:3000/auth/strava" method="get">
          <input
            type="image"
            value="Log"
            src="../assets/btn_strava_connectwith_orange@2x.png"
          ></input>
        </form>
      </div>
      <div className="main">
        <div className="bikeData">
          <h3>{bikeData.bikeName}</h3>
          <h3>{bikeData.bikeDistance} Miles</h3>
          <h3>{bikeData.bikeElevation} Feet</h3>
          <h3>{bikeData.bikeMovingTime} Hours</h3>
        </div>
        <div className="partsDisplay">
          {parts.map((part, idx) => (
            <PartLI user={user} setUser={setUser} idx={idx} />
          ))}
        </div>
        <div className="ridesDisplay">
          {rides.map((ride) => (
            <RideLI user={user} setUser={setUser} ride={ride} />
          ))}
        </div>
      </div>
    </div>
  );
}
