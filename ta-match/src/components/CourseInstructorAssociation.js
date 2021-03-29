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
import NativeSelect from '@material-ui/core/NativeSelect';

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
  },
  row: {
    backgroundColor: "#ECECEC"
  }
});

export default function CourseInstructorAssociation() {
  // styles
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false); // fix once useEffect is populated
  const courseData = [
    {"course": "ECE123"},
    {"course": "ECE456"},
    {"course": "ECE789"},
  ]

  const courseState = [
      "alice@uwo.ca", "bob@uwo.ca", "charles@uwo.ca", "derek@uwo.ca"
  ]
  
  return (
    <div>
      <h3>Course-Instructor Association</h3>
      <Typography component="div">
              <Box fontStyle="italic" >
              This function will assign instructors to courses for the current semester.
              </Box>
          </Typography>
        {!isLoading ? <TableContainer className={classes.container}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell>Course Code</TableCell>
              <TableCell>Assigned Professor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {courseData.map((course)=>{
              return (
                <TableRow key={course["course"]}>
                  <TableCell>{course["course"]}</TableCell>
                  <TableCell>                                                            
                    <NativeSelect
                        id="select"
                        onChange={(e) => {
                          console.log(e.target.selectedIndex) // update
                            // setRank(
                            //     applicant.email,
                            //     e.target.selectedIndex +1
                            // );
                        }}
                        >
                        <option value="">Select professor</option>
                        
                        {courseState.map(
                            (inst,index) => {
                                return (<option key={index}>{inst}</option>);
                            }
                        )}
                      </NativeSelect>
                      <Button className={classes.assignBtn}
                          color="primary"
                          // onClick={() => {
                          //     updateRank(courseState["course_code"],applicant.email);
                          // }}
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
  