import React, { useState, useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Checkbox } from "@material-ui/core";

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

  export default function DisplayApplicants() {
    let newDate = new Date()
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    if(month >= 1 && month <= 4){
      month = "winter";
    }
    else if(month >= 5 && month <= 8){
        month = "summer";
    }
    else{
        month = "fall";
    }
    // styles
    const classes = useStyles();
    const [applicantData, setApplicantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(0);
    const [test, setTest] = useState(0);
    

    useEffect(() => {
        let c = [];
        fetch(`http://localhost:5000/api/semester/${month+year}`)
          .then((response)=>{
            response.json()
              .then((data)=>{
                setApplicantData(data);
                data.map((k)=>{
                    k.applicants.map((a)=>{
                        c.push(a)
                    })
                })
                if(data.length == 0){
                  setIsLoading(true);
                }
                else if(c.length == 0){
                    setIsLoading(true);
                }
                else{
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
      }, []);
    
    return (
        <div>
        {!isLoading ? <TableContainer className={classes.container}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Experience Level</TableCell>
                <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {applicantData.map((course)=>{
              return (
                <TableRow key={course.course}>
                  <TableCell component="th" scope="row">{course.course}</TableCell>
                  <TableCell>
                    {
                        course.names.map(a => {
                            return(
                            <div>
                                <li style={{listStyleType: 'none'}}key={a}>{a}</li>

                            </div>
                            )
                        })
                    }
                   </TableCell>
                   <TableCell>
                    {
                        course.applicants.map(e => {
                            return(
                            <div>
                                <li style={{listStyleType: 'none'}}key={e}>{e}</li>

                            </div>
                            )
                        })
                    }
                   </TableCell>
                   <TableCell>
                    {
                        course.status.map(s => {
                            return(
                            <div>
                                <li style={{listStyleType: 'none'}}key={s}>{s}</li>

                            </div>
                            )
                        })
                    }
                   </TableCell>
                   <TableCell>
                    {
                        course.experience.map(l => {
                            return(
                            <div>
                                <li style={{listStyleType: 'none'}}key={l}>{l}</li>

                            </div>
                            )
                        })
                    }
                    </TableCell>
                  <TableCell align="right">
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