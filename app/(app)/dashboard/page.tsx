'use client'

import { useAuth } from '@/hooks/auth'
import React from 'react'

const Dashboard = () => {
  const { user, logout } = useAuth({ middleware: 'auth' })
  return (
    <div>
      <p>Welcome back in your Dashboard {user.name}</p>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default Dashboard