
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

const useStyles = makeStyles({
    root: {
      minWidth: 275,
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
  });


export default function CourseInfo () {
    
    const [isLoading, setIsLoading] = useState(true);
    const [applicantData, setApplicationData] = useState([]);
    const { currentUser } = useAuth()
    const [error, setError] = useState("")
    let ranking = 0;

    useEffect(() => {
        async function fetchApplicationData(){
            // need to make dynamic with email
            // console.log(currentUser.email)
            //getApplicantData(currentUser.email)
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

    async function updateRank(course, email, sem){
            postRank(course, email, ranking, sem)
            .then(response=>{
                if(response.status == "404"){
                    setError("Cannot assign same rank to multiple applicants")
                }
                else{
                    console.log(response)
                    window.location.reload()
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
        

        //console.log(applicantData)
        return (
            <div> 
                {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
            
            {applicantData["courseList"].map((course, index)=>{
                return <Grid key={index} item xs={12} sm={6} md={4}>
                
                <Card key={index + "Card"} className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
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
                                    {course["applicant_list"].map((applicant,index)=>{
                                        return <div key={index}>
                                            {/* need to be dynamic */}
                                            <p>Name: {applicant.name}</p>
                                            <p>Email: {applicant.email}</p>
                                            <p>Fundable: {applicant.fundable}</p>
                                            <p>Answer 1: {applicant.answer1}</p>
                                            <p>Answer 2: {applicant.answer2}</p>
                                            <p>Current Rank: {applicant.profRank}</p>
                                            <InputLabel id="rank" >Rank</InputLabel>
                                        
                                            <NativeSelect id="select" onChange={e=> {setRank((e.target.selectedIndex)+1);}}>
                                                <option value=""> Select rank</option>
                                            {course["applicant_list"].map((applicant, index) => {
                                                return <option key={index} >{index + 1}</option>;
                                            })}
                                            </NativeSelect>
                                            <Button color="primary" onClick={()=>{updateRank(course["course_code"],applicant.email,"summer2021")}} style={{float: "right", marginLeft: "20px"}}>Submit</Button>
                                        </div>
                                    })}
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