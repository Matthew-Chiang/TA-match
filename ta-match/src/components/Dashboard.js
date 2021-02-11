import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Button from '@material-ui/core/Button';

export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()
  
    async function handleLogout() {
      setError("")
        console.log(currentUser)
      try {
        await logout()
        history.push("/login")
      } catch {
        setError("Failed to log out")
      }
    }
  
    return (
        <div>
        <Button
        component={Link}
        onClick={handleLogout}
    >
        Logout
    </Button>
    <h1>Welcome, </h1>
    </div>
    )
  }