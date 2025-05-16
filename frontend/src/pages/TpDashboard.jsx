import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CreateJob from '../components/CreateJob'
import TPDashboard from '../components/TPDashboard'
function TpDashboard() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('tpToken')
    navigate('/')
  }

  return (
    <div>
      <div className='min-w-full h-full bg-black'>
        <button onClick={logout} className='bg-red-400 h-20 w-24'>Logout</button>
        <CreateJob/>
        <TPDashboard/>
      </div>
    </div>
  )
}

export default TpDashboard
