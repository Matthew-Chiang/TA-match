import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DisplayApplicants from './DisplayApplicants.js';


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
        isLoading: false,
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
       this.setState({
         isLoading: true,
       })
     });
    }

    render() {
      const {applicants} = this.state;
      console.log(applicants)
      return (
        <div>
    
            <h3>Import Applicant Information</h3>
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
          <DisplayApplicants></DisplayApplicants>

          {this.state.isLoading ? 
          <DisplayApplicants></DisplayApplicants>

          : <div></div>} 
      

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
  

