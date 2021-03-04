
import React, {Component, useState, useRef, useEffect} from 'react'
import Accordion from '@material-ui/core/Accordion';
import { AccordionDetails, AccordionSummary } from '@material-ui/core';
import {Select, MenuItem, InputLabel, NativeSelect} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'; 
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getApplicantData, postRank } from '../services/ProfService';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useAuth } from "../contexts/AuthContext";
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles({
    root: {
      //minWidth: 275
      width: 800
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginTop: 6,
    },
    container: {
        marginTop: 20,
      },
      table: {
        minWidth: 1000,
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


export default function CourseInfo () {
    
    const [isLoading, setIsLoading] = useState(true);
    const [applicantData, setApplicationData] = useState([]);
    const { currentUser } = useAuth()
    const [error, setError] = useState("")
    let ranking = 0;

    useEffect(() => {
        async function fetchApplicationData(){
            getApplicantData(localStorage.getItem('email'))
            .then(response=>{
                const data = response
                setApplicationData(data)
                setIsLoading(false)
            })
            .catch(err =>{
                console.log(err)
            })
        }
        fetchApplicationData()
    }, []);

    function setRank(rank){
        ranking = rank-1
        console.log(ranking)
    }

    function refreshRank(){
        getApplicantData(localStorage.getItem('email'))
            .then(response=>{
                const data = response
                setApplicationData(data)
                setIsLoading(false)
            })
            .catch(err =>{
                console.log(err)
            })
    }

    function updateRank(course, email, sem){
            postRank(course, email, ranking, sem)
            .then(response=>{
                if(response.status == "404"){
                    setError("Cannot assign same rank to multiple applicants")
                }
                else{
                    refreshRank();
                    console.log(response)
                    //window.location.reload()
                }
            }).catch(err=>{
                console.log(err)
            }) 
    }

    const classes = useStyles();
    if (isLoading) {
    return <div className="App">Loading...</div>;
    }

    if(applicantData["courseList"]){
        

        // console.log(applicantData["name"])
        return (
            <div> 
                {error && <Alert  severity="error">{error}</Alert>}
            <Grid container spacing={3}>
            
            {applicantData["courseList"].map((course, index)=>{
                return <Grid key={index} item xs={12} >
                
                <Card key={index + "Card"} className={classes.container} variant="outlined">
                    <CardContent>
                        <Typography className={classes.table} color="textSecondary" gutterBottom>
                        University of Western Ontario
                        </Typography>
                        <h2 color="textPrimary"> {course["course_code"]} </h2>
                        <Typography className={classes.pos} color="textSecondary">
                        Summer 2021
                        
                        </Typography>
                        <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div>Applicants:</div>
                        </AccordionSummary>
                            <AccordionDetails>
                                <div>
                            <TableContainer className={classes.container}>
                                <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                    <TableCell><h3>Name</h3></TableCell>
                                    <TableCell><h3>Email</h3></TableCell>
                                    <TableCell><h3>Fundable</h3></TableCell>
                                    <TableCell><h3>Answer 1</h3></TableCell>
                                    <TableCell><h3>Answer 2</h3></TableCell>
                                    <TableCell><h3>Current Rank</h3></TableCell>
                                    <TableCell><h3>Update Rank</h3></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {course["applicant_list"].map((applicant,index)=>{
                                    if(!applicant.profRank){
                                        applicant.profRank = "Unranked"
                                    }
                                return (
                                <TableRow key={course["course"]}>
                                    <TableCell>{applicant.name}</TableCell>
                                    <TableCell>{applicant.email}</TableCell>
                                    <TableCell>{applicant.fundable}</TableCell>
                                    <TableCell>{applicant.answer1}</TableCell>
                                    <TableCell>{applicant.answer2}</TableCell>
                                    <TableCell>{applicant.profRank}</TableCell>
                                    <TableCell>
                                        <NativeSelect id="select" onChange={e=> {setRank((e.target.selectedIndex)+1);}}>
                                            <option value=""> Select rank</option>
                                            {course["applicant_list"].map((applicant, index) => {
                                                return <option key={index} >{index + 1}</option>;
                                            })}
                                        </NativeSelect>
                                        <Button color="primary" 
                                            onClick={()=>{updateRank(course["course_code"],applicant.email,"summer2021")}}>
                                            Submit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )
                                })}
                                </TableBody>
                                </Table>
                            </TableContainer>
                                </div>
                            </AccordionDetails>
                    </Accordion>
                    </CardContent>
                </Card>
                    
                </Grid> 
            })}
            </Grid> 
            </div>
        
        );
    }
    else{
        return(
            <Typography className={classes.title} color="textSecondary">
                No Classes
            </Typography>
        ); 
    }
    
}


// export default withStyles(styles)(CourseInfo)

//table

{/* <TableContainer className={classes.container}>
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
      </TableContainer> */}

    //   {course["applicant_list"].map((applicant,index)=>{
    //     return <div key={index}>
    //         {/* need to be dynamic */}
    //         <p>Name: {applicant.name}</p>
    //         <p>Email: {applicant.email}</p>
    //         <p>Fundable: {applicant.fundable}</p>
    //         <p>Answer 1: {applicant.answer1}</p>
    //         <p>Answer 2: {applicant.answer2}</p>
    //         <p>Current Rank: {applicant.profRank}</p>
    //         <InputLabel id="rank" >Rank</InputLabel>
        
    //         <NativeSelect id="select" onChange={e=> {setRank((e.target.selectedIndex)+1);}}>
    //             <option value=""> Select rank</option>
    //         {course["applicant_list"].map((applicant, index) => {
    //             return <option key={index} >{index + 1}</option>;
    //         })}
    //         </NativeSelect>
    //         <Button color="primary" 
    //         onClick={()=>{updateRank(course["course_code"],applicant.email,"summer2021")}} 
    //         style={{float: "right", marginLeft: "20px"}}>Submit</Button>
    //     </div>
    // })}