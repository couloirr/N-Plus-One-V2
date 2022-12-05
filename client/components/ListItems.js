import React from 'react';

export const PartLI = ({ user, setUser, idx }) => {
  const {
    partName,
    partIconName,
    partDistance,
    partMovingTime,
    serviceIntervals,
    _id,
  } = user.parts[idx];
  const handleClick = () => {
    setUser((current) => {
      const part = { ...current.parts[idx] };
      part.partName = 'The NEEEEW Hotness';
      const update = (current.parts[idx] = part);
      return { ...current, update };
    });
    console.log(user, 'after');
  };
  return (
    <div>
      <h1>{partName}</h1>
      <button onClick={handleClick} />
    </div>
  );
};

export const RideLI = ({ user, setUser, ride }) => {
  const { rideName, rideElevation, rideDistance, rideTime, _id } = ride;
  return <h1>{rideName}</h1>;
};
