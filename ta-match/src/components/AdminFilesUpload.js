import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CourseInfoCard from './CourseInfoCard.js';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const apiURL = 'http://localhost:5000/api';

class AdminFilesUpload extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ApplicantsFile: null,
        InstructorsFile: null,
        semester: 'summer',
        year: 2021,
        applicants: "",
        //isLoading: React.useState(true),
      }

      this.onChangeHandler.bind(this);
      this.sendFile.bind(this);
      
    }
    onChangeHandler(event, filename){
      this.setState({
        [filename]: event.target.files[0]
      });
    }
    sendFile(filename){
      console.log(filename);
      console.log(this.state['ApplicantsFile'])
      const data = new FormData();
      data.append(filename, this.state[filename]);
      data.append('semester', this.state.semester);
      data.append('year', this.state.year);
      axios.post(apiURL + '/upload' + filename, data, { 
  
      }).then(res => {
       console.log(res.statusText);
     });
    }

    getAppicantData(){
      fetch(`http://localhost:5000/api/getAllApplicantData`)
            .then((response) => {
                response
                    .json()
                    .then((data) => {
                      this.setState({
                        applicants: data,
                      })
                      // if(data.length ==0){
                      //   this.setState({
                      //     isLoading: React.useState(false)
                      //   })
                      // }
                      // else{
                      //   this.setState({
                      //     isLoading: React.useState(false)
                      //   })
                      // }
                      console.log(this.state.applicants)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }


    render() {
      const {applicants} = this.state;
      console.log(applicants)
      return (
        <div>
    
            <h3>Upload Applicant Data</h3>
            <Typography component="div">
              <Box fontStyle="italic" >
              This function will load all the application information into the database in preparation for the TA matching process.
              </Box>
          </Typography>
            <p>Please upload a file in the form of a spreadsheet (XLS, XLSX, CSV) and that includes the following columns: Course Code, Applicant Name, Applicant Email, Availability Hours, Rank of Course, Qn, An (where n is the number of questions).</p>
            
           
            <br></br>
            Upload spreadsheet: <input
              type="file"
              id="applicantData"
              accept=".xlsx, .xls, .csv"
              onChange={(e)=>this.onChangeHandler(e, 'ApplicantsFile')}
            />
          <Button className="submitButton"
            color="primary"
            variant="contained"
            onClick={()=>this.sendFile('ApplicantsFile')}
            >
            Submit 
          </Button>
          {/* <Button className="submitButton"
            color="primary"
            variant="contained"
            onClick={()=>this.getAppicantData()}
            >
            Test 
          </Button> */}

          {/* {!this.state.isLoading ? */}
           <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            
            {/* {console.log(applicants["profs"])} */}
            {/* {Object.keys(applicants["profs"]).map((p)=>{
              return(
                console.log((applicants["profs"])[p])
              )
            })} */}
            {/* <TableBody>
            
            {applicants["profs"].map((p)=>{

                return (
                  applicants.profs[p].courseList.map((a)=>{
                    console.log(a["applicant_list"].name)
                  })
                // <div>
                //   <TableRow key={course["profs"]}>
                //     <TableCell component="th" scope="row">{course["course"]}</TableCell>
                //     <TableCell>{course["ta_hours"]}</TableCell>
                //     <TableCell align="right">
                //     <Button variant="contained" color="default" onClick={() => handleClickOpen(course["course"],course["ta_hours"])}>
                //       Edit
                //     </Button>
                //     </TableCell>
                // </TableRow>
                // </div>
                )
              })}
            </TableBody> */}
          </Table>
        </TableContainer>
         {/* : <div></div>} */}
      

          {/* // <br/>
          // <br/>
          // Choose Instructors File: <input
          //     type="file"
          //     id="instructorsData"
          //     accept=".xlsx, .xls, .csv"
          //     onChange={(e)=>this.onChangeHandler(e, 'InstructorsFile')}
          //   />
          // <Button className="submitButton"
          //   color="primary"
          //   variant="contained"
          //   onClick={()=>this.sendFile('InstructorsFile')}
          //   >
          //   Submit 
          // </Button> */}
        </div>
        
      );
    }
}
export default AdminFilesUpload;
  