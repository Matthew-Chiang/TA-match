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
  }
});

export default function HoursCalculation() {
  // styles
  const classes = useStyles();

  // parse Excel
  const [hoursData, setCalcHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(0);
  const [test, setTest] = useState(0);
    // Modal 
  const [open, setOpen] = React.useState(false);
  const [course,setCourse] = useState("");
  const [hours,setHours] = useState("N/A");
  const [newHours, setNewHours] = useState("");

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
      fetch(`http://localhost:5000/api/calcHours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            hours: d
        }),
      })
      .then(response=>{
        if (response.status == 400) {
          alert("Spreadsheet Invalid. Please upload one with the following columns: Instructor, Course, Hrs 2020,Enrol 2020, Enrol 2021.")
        }
        else {
          console.log(response)
          setTest(test+1);
        }
      })
      .catch(err =>{
          alert(err);
      })
    });
  };

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
    fetch(`http://localhost:5000/api/updateHours`, {
      method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            course: course,
            hours: newHours
        }),
    })
    .then(response=>{
        setUpdating(updating+1);
    })
    .catch(err =>{
        console.log(err)
    })
  }

  //get all calculated hours
  useEffect(() => {
    fetch(`http://localhost:5000/api/getHours`)
      .then((response)=>{
        response.json()
          .then((data)=>{
            setCalcHours(data);
            if(data.length == 0){
              setIsLoading(true);
            }else{
              setIsLoading(false);
            }
            
            console.log(data)
          })
          .catch((err)=>{
            console.log(err);
          })
      })
      .catch((err)=>{
        console.log(err)
      })
  }, [updating,test]);

  
  return (
    <div>
      <h3>Calculate TA Hours</h3>
      <Typography component="div">
              <Box fontStyle="italic" >
              This function will load all the course enrolment information to calculate recommended TA hours for each course.
              </Box>
          </Typography>
      <p>Please upload a file in the form of a spreadsheet (XLS, XLSX, CSV) and that includes the following columns: Instructor (email), Course, Hrs 2020, Enrol 2020, Enrol 2021.</p>
      <br></br>
      Upload spreadsheet: <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      {/* <Button 
            color="primary"
            variant="contained"
            // onClick={() => getCalcHours()}
             >
            Calculate TA Hours 
          </Button> */}
        {!isLoading ? <TableContainer className={classes.container}>
        <Table className={classes.table} size="small">
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
      : <div></div>}
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
  