import React from 'react'
import LandingPage from './assets/Components/LandingPage'
import UserDashBoard from './assets/Components/UserDashBoard';
import { Route, Routes } from 'react-router-dom';
import OfficialsDashBoard from './assets/Components/OfficialsDashBoard';

const App = () => {
  return (
    <>
    {/* <LandingPage/> */}
    {/* <UserDashBoard/> */}
    <OfficialsDashBoard/>
    </>
  )
}

export default App;