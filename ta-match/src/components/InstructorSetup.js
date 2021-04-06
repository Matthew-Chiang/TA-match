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

export default function InstructorSetup({
    setAssociationFlag,
  }) {
  // styles
  const classes = useStyles();

  // parse Excel
  const [instructorInfo, setInstructorInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(0);
  const [test, setTest] = useState(0);
  const [file, setFile] = useState();
  const [block, setBlock] = useState('');

  const sendFile = ({file}) => {
    const filename = file.name;
    console.log(filename);
    console.log(file)
    const data = new FormData();
    data.append('InstructorsFile', file); 
    axios.post(apiURL + '/uploadInstructorsFile', data, {

    }).then(response=>{
      if (response.status == 400) {
        alert("Spreadsheet Invalid. Please upload one with the following columns: Instructor Name, Instructor Email.")
      }
      else {
        
        console.log(response)
      }
      })
      .catch(err =>{
          alert(err);
      })
  };

  //get all instructors
  useEffect(() => {
    fetch(`${apiURL}/getInstructors`)
      .then((response)=>{
        response.json()
          .then((data)=>{
            setInstructorInfo(data);
            if(data.length == 0){
              setIsLoading(true);
              setBlock(false);
            }else{
              setIsLoading(false);
              setBlock(true);
            }
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
      <h3>Instructor Setup</h3>
      <Typography component="div">
              <Box fontStyle="italic" >
              This function will load all the instructor information for the current semester.
              </Box>
          </Typography>
      <p>Please upload a file in the form of a spreadsheet (XLS, XLSX, CSV) and that includes the following columns: Instructor Name, Instructor Email.</p>
      <br></br>
      Upload spreadsheet: <input
      disabled={block}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => {
          const file = e.target.files[0];
          setFile(file);
          console.log({file});
          sendFile({file});
        }}
      />
      <Button 
            color="primary"
            variant="contained"
            disabled={block}
            onClick={() => {
              
              setAssociationFlag(true);
              setTest(test+1);
            }}
             >
            Submit
          </Button>
        {!isLoading ? <TableContainer className={classes.container}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell>Instructor Name</TableCell>
              <TableCell>Instructor Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {instructorInfo.map((e)=>{
              return (
                <TableRow key={e["email"]}>
                  <TableCell component="th" scope="row">{e["name"]}</TableCell>
                  <TableCell>{e["email"]}</TableCell>
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
  