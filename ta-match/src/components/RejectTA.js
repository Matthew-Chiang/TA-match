import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const apiURL = 'http://localhost:5000/api';

const useStyles = makeStyles({
  container: {
    marginTop: 20,
  },
  table: {
    minWidth: 650,
  },
  dialogText: {
    fontSize: 18,
  },
  txtField: {
    marginLeft: 10,
  },
  overrideBtn: {
    marginRight: 20,
    marginBottom: 10
  },
  row: {
    backgroundColor: "#ECECEC"
  }
});

export default function RejectTA(
    {
        email,
        course,
        rejectionAPIcall,

    })
{
  // styles
  const classes = useStyles();

    // Modal 
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = useState("")



  const handleClickOpen = () => {
    console.log(email)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOverride = () => {
      //updateHours
      
    rejectionAPIcall(email, "rejected", description);
    handleClose();
    
  }

  
  return (
    <div>
      <Button onClick={() => handleClickOpen()}>
            Reject From Course
        </Button >
      <Dialog
          open={open}
          fullWidth={true}
          onClose={handleClose}
        >
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              <b>Course:</b> {course}
              <br />
              <br />
              <b>Reason for Rejection:</b>
              <TextField 
              className={classes.txtField} 
              id="standard-basic" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.overrideBtn} disabled={description.length === 0} onClick={handleOverride} variant="contained" color="primary">
              Submit Rejection
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  )
}
  