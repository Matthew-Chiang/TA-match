import React, { useState } from "react";
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
      // probably write to firestore here
    });
  };

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
      console.log(newHours) // update firestore
    }
    handleClose();
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
    {items.length > 0 ? (
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
            {items.filter(e => {
              if (e["Course"] == undefined) {
                return false;
              }
              return true;
            }).map((row) => {
              let hoursCalc = Math.ceil((row["Hrs 2020"]/row["Enrol 2020"])*row["Enrol 2021"]);
              return (
                <TableRow key={row["Course"]}>
                  <TableCell component="th" scope="row">{row["Course"]}</TableCell>
                  <TableCell>{(isNaN(hoursCalc) ? "N/A" : hoursCalc)}</TableCell>
                  <TableCell align="right">
                  <Button variant="contained" color="default" onClick={() => handleClickOpen(row["Course"],hoursCalc)}>
                    Edit
                  </Button>
                  </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

    ) : null}
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
              <b>Allocated hours (current):</b> {hours}
              <br />
              <br />
              <b>Allocated hours (new):</b>
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
  