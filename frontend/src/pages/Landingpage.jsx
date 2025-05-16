import React from 'react';
import Home from '../components/Home';
import HomeNavbar from '../components/HomeNavbar';

function Landingpage() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <HomeNavbar />
      <Home />
    </div>
  );
}

export default Landingpage;