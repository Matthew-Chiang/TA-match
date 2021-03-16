import React, { useState, useEffect } from "react";
import axios from 'axios';
import * as XLSX from "xlsx";

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
import { postCalcHours, updateCalcHours, getHours } from '../services/ChairService';

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
  }
});

export default function HoursCalculation() {
  // styles
  const classes = useStyles();

  // parse Excel
  const [items, setItems] = useState([]);
  const [hoursData, setCalcHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d); 
      postCalcHours("summer2021",d)
      .then(response=>{
        console.log(response)
        //this is to populate the hours after uploading a spreadsheet
        getCalcHours();
      })
      .catch(err =>{
          console.log(err)
      })
    });
  };

//this is to populate the hours if clicked
function getCalcHours() {
  getHours("summer2021")
  .then(response=>{
      console.log(response)
            
      setCalcHours(response)
      setIsLoading(false)
  })
  .catch(err =>{
      console.log(err)
  })
}


  // Modal 
  const [open, setOpen] = React.useState(false);
  const [course,setCourse] = useState("");
  const [hours,setHours] = useState("N/A");
  const [newHours, setNewHours] = useState("");

  const handleClickOpen = (course,hours) => {
    setNewHours("")
    setCourse(course);
    setHours(hours)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOverride = () => {
    if(newHours != "") {
      updateHours()
    }
    handleClose();
    
  }

  function updateHours(){
    updateCalcHours("summer2021",course,newHours)
    .then(response=>{
        console.log(response)
        getCalcHours()
    })
    .catch(err =>{
        console.log(err)
    })
  }

  
  return (
    <div>
      <h1>Calculate TA Hours</h1>
      Upload spreadsheet: <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <hr></hr>
      <Button className="submitButton"
            color="primary"
            variant="contained"
            onClick={() => getCalcHours()}
             >
            See Calculated TA Hours 
          </Button>
        <TableContainer className={classes.container}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Calculated Hours</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {hoursData.map((course)=>{

              return (
                <TableRow key={course["course"]}>
                  <TableCell component="th" scope="row">{course["course"]}</TableCell>
                  <TableCell>{course["ta_hours"]}</TableCell>
                  <TableCell align="right">
                  <Button variant="contained" color="default" onClick={() => handleClickOpen(course["course"],course["ta_hours"])}>
                    Edit
                  </Button>
                  </TableCell>
              </TableRow>
              )
            })}
            
          </TableBody>
        </Table>
      </TableContainer>

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
              <b>Calculated hours (current):</b> {hours}
              <br />
              <br />
              <b>Calculated hours (new):</b>
              <TextField 
              className={classes.txtField} 
              id="standard-basic" 
              value={newHours}
              onChange={e => setNewHours(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.overrideBtn} onClick={handleOverride} variant="contained" color="primary">
              Override
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  )
}
  