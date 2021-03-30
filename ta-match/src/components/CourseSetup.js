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

export default function CourseSetup() {
  // styles
  const classes = useStyles();

  // parse Excel
  const [courseInfo, setCourseInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(0);

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
      console.log(d)
      fetch(`${apiURL}/uploadCourseFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            coursesInfo: d
        }),
      })
      .then(response=>{
        if (response.status == 400) {
          alert("Spreadsheet Invalid. Please upload one with the following columns: Course Code, Course Name.")
        }
        else {
          console.log(response)
        }
      })
      .catch(err =>{
          alert(err);
      })
    });
  };

  //get all calculated hours
  useEffect(() => {
    fetch(`${apiURL}/getCourses`)
      .then((response)=>{
        response.json()
          .then((data)=>{
            setCourseInfo(data);
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
  }, [test]);

  
  return (
    <div>
      <h3>Course Setup</h3>
      <Typography component="div">
              <Box fontStyle="italic" >
              This function will load all the course information for the current semester.
              </Box>
          </Typography>
      <p>Please upload a file in the form of a spreadsheet (XLS, XLSX, CSV) and that includes the following columns: Course Code, Course Name.</p>
      <br></br>
      Upload spreadsheet: <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <Button 
            color="primary"
            variant="contained"
            onClick={() => setTest(test+1)}
             >
            Submit
          </Button>
        {!isLoading ? <TableContainer className={classes.container}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {courseInfo.map((course)=>{
              return (
                <TableRow key={course["course"]}>
                  <TableCell component="th" scope="row">{course["course"]}</TableCell>
                  <TableCell>{course["course_name"]}</TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      : <div></div>}
    </div>
  )
}
  