import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import {Box, Button, makeStyles, Typography} from '@material-ui/core';

const useStyles = makeStyles({
  navBar: {
    marginLeft: 20,
  }
});

export default function Dashboard(props) {
    const classes = useStyles();

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    let newDate = new Date()
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    if(month >= 1 && month <= 4){
      month = "Winter";
    }
    else if(month >= 5 && month <= 8){
        month = "Summer";
    }
    else{
        month = "Fall";
    }
  
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
        <Box display="flex" alignItems="center">
          <Box >
            <Typography><span style={{fontWeight:"bold"}}>Current Semester: </span>{month} {year}</Typography>
          </Box>
          <Box flexGrow={1} textAlign="right">
            <Button className={classes.navBar} href={'/'+props.role} color="primary">Dashboard</Button>
            <Button className={classes.navBar} href={'/'+props.role+'/history'} color="primary">View History</Button>
            <Button className={classes.navBar} color="secondary" onClick={handleLogout}>Logout</Button>
          </Box>
        </Box>
    )
  }