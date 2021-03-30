import React, { useState, useEffect } from "react";

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
import { Select, MenuItem, InputLabel, NativeSelect, FormControl } from "@material-ui/core";

const apiURL = 'http://localhost:5000/api';

const useStyles = makeStyles({
  container: {
    marginTop: 20,
  },
  table: {
    minWidth: 650,
  },
  assignBtn: {
    marginLeft: 20,
    marginTop: 10,
  },
  row: {
    backgroundColor: "#ECECEC"
  },
  formControl: {
    marginBottom: 5,
    minWidth: 140,
}
});

export default function CourseInstructorAssociation() {
  // styles
  const classes = useStyles();
  const [instructorInfo, setInstructorInfo] = useState([]);
  const [courseInfo, setCourseInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(0);

  useEffect(() => {
    fetch(`${apiURL}/getInstructors`)
      .then((response)=>{
        response.json()
          .then((data)=>{
            console.log(data)
            setInstructorInfo(data);
            if(data.length == 0){
              setIsLoading(true);
            }else{
              setIsLoading(false);
            }
          })
          .catch((err)=>{
            console.log(err);
          })
      })
      .catch((err)=>{
        console.log(err)
      })

      fetch(`${apiURL}/getCourses`)
      .then((response)=>{
        response.json()
          .then((data)=>{
            setCourseInfo(data);
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

  function assignInstructor(course, instructor) {
    fetch(`${apiURL}/assignInstructors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          course: course,
          instructor: instructor,
      }),
   })
    .then((response)=>{
      console.log(response)
      
    })
    .catch((err)=>{
      console.log(err);
    });
  };

  
  return (
    <div>
      <h3>Course-Instructor Association</h3>
      <Typography component="div">
              <Box fontStyle="italic" >
              This function will assign instructors to courses for the current semester. 
              </Box>
          </Typography>
        {!isLoading ? <TableContainer className={classes.container}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Current Professor</TableCell>
              <TableCell>Assign Professor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {courseInfo.map((course)=>{
              return (
                <TableRow key={course["course"]}>
                  <TableCell>{course["course"]}</TableCell>
                  <TableCell>{course["course_name"]}</TableCell>
                  <TableCell>{course["instructor"]}</TableCell>
                  <TableCell>     
                  <FormControl className={classes.formControl}>
                  <InputLabel>Select professor</InputLabel>
                  <Select defaultValue="" id="select" onChange={(e) => {
                          assignInstructor(course["course"],e.target.value)
                        }}>
                    {instructorInfo.map(
                        (inst,index) => {
                            return (<MenuItem value={inst["email"]} key={index}>{inst["email"]}</MenuItem>);
                        }
                    )}
                  </Select>
                  </FormControl>                                                      
                      <Button className={classes.assignBtn}
                          color="primary"
                          onClick={() => {
                            setTest(test+1)
                          }}
                      >Assign</Button>
                 </TableCell>
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
  