import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from './hooks/useAuth'

function AuthLayout() {
  useAuth()

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AuthLayout