
import React, {Component, useState, useEffect} from 'react'
import Accordion from '@material-ui/core/Accordion';
import { AccordionDetails, AccordionSummary } from '@material-ui/core';
import {Select, MenuItem, InputLabel, NativeSelect} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'; 
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getApplicantData } from '../services/ProfService';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useAuth } from "../contexts/AuthContext"

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

    useEffect(() => {
        async function fetchApplicationData(){
            // need to make dynamic with email
            console.log(currentUser.email)
            getApplicantData("john@uwo.ca")
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

        const classes = useStyles();
        if (isLoading) {
        return <div className="App">Loading...</div>;
        }
            return (
                <div> 
                <Grid container spacing={3}>
                {applicantData["courseList"].map((course, index)=>{
                    return <Grid item xs={12} sm={6} md={4}>

                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            University of Western Ontario
                            </Typography>
                            <p> {course["course_code"]} </p>
                            <Typography className={classes.pos} color="textSecondary">
                            Winter 2021
                            </Typography>
                            <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div>Applicants:</div>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div>
                                        {course["applicant_list"].map((applicant,index)=>{
                                            return <div>
                                                {/* need to be dynamic */}
                                                <p>Name: {applicant.name}</p>
                                                <p>Email: {applicant.email}</p>
                                                <p>Fundable: {applicant.fundable}</p>
                                                <p>Answer 1: {applicant.answer1}</p>
                                                <p>Answer 2: {applicant.answer2}</p>
                                                <InputLabel id="label">Rank</InputLabel>
                                                <NativeSelect id="select">
                                                {course["applicant_list"].map((applicant, index) => {
                                                    return <option>{index + 1}</option>;
                                                })}
                                                </NativeSelect>
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


// export default withStyles(styles)(CourseInfo)