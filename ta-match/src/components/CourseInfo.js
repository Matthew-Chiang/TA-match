
import React, {Component} from 'react'
import Accordion from '@material-ui/core/Accordion';
import { AccordionDetails, AccordionSummary } from '@material-ui/core';
import {Select, MenuItem, InputLabel, NativeSelect} from '@material-ui/core';
import { getApplicantData } from '../services/ProfService'; 

const url = "http://localhost:5000/api/"


class CourseInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            applicantData: []
        }
    }
    
    async componentDidMount () {
        await getApplicantData("john@uwo.ca")
        .then(response=>{
            const data = response
            this.setState({applicantData: data})
            this.setState({ isLoading: false });
        })
        .catch(err =>{
            console.log(err)
        })
    }
    render(){
        const { isLoading, applicantData } = this.state;
        if (isLoading) {
        return <div className="App">Loading...</div>;
        }
            return (
                <div>  
                {applicantData["courseList"].map((course, index)=>{
                    return <div>    
                    <Accordion>
                        <AccordionSummary>
                            <p> {course["course_code"]} </p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>Applicants</div>
                            <div>
                                {course["applicant_list"].map((applicant,index)=>{
                                    return <div>
                                        <p>Name: {applicant.name}</p>
                                        <p>email: {applicant.email}</p>
                                        <p>fundable: {applicant.fundable}</p>
                                        <p>answer1: {applicant.answer1}</p>
                                        <p>answer2: {applicant.answer2}</p>
                                        <InputLabel id="label">Rank</InputLabel>
                                        <NativeSelect id="select">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </NativeSelect>
                                    </div>
                                })}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    </div>
                    // return <h1>{course.course}</h1>
                })}
            </div>
            );
    }
}


export default CourseInfo;