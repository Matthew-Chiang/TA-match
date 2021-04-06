import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DisplayApplicants from './DisplayApplicants';


const apiURL = 'http://localhost:5000/api';


class AdminFilesUpload extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        ApplicantsFile: null,
        InstructorsFile: null,
        semester: 'summer',
        year: 2021,
        hasData: false,
        applicants: "",
        isLoading: false,
        block: false,
      }

      let c = [];
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
      fetch(`http://localhost:5000/api/semester/${month+year}`)
      .then((response)=>{
        
        response.json()
          .then((data)=>{
            data.map((k)=>{
                k.applicants.map((a)=>{
                    c.push(a)
                })
            })
            if(data.length == 0){
              this.setState({isLoading:false})
            }
            else if(c.length == 0){
              this.setState({isLoading:false})
            }
            else{
              this.setState({isLoading:true})
              this.setState({block:true})
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
      
      this.onChangeHandler.bind(this);
      this.sendFile.bind(this);
      this.hasDataCallback = this.hasDataCallback.bind(this);
      
    }

    
    onChangeHandler(event, filename){
      this.setState({
        [filename]: event.target.files[0]
      });
      this.sendFile('ApplicantsFile')
      this.props.setAllCourseFlag(true)
    }

    hasDataCallback(hasData){
      this.setState({
        hasData: hasData
      });
    }

    sendFile(filename){
      console.log(filename);
      console.log(this.state['ApplicantsFile'])
      const data = new FormData();
      data.append('ApplicantsFile', this.state[filename]);
      axios.post(apiURL + '/uploadApplicantsFile', data, { 
  
      }).then(res => {
       console.log(res.statusText);
      //  this.setState({
      //    isLoading: true,
      //  })
     });
    }

    render() {
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
              //disabled={!this.state.hasData}
              disabled={this.state.block}
              type="file"
              id="applicantData"
              accept=".xlsx, .xls, .csv"
              onChange={(e)=>this.onChangeHandler(e, 'ApplicantsFile')}
            />
          <Button className="submitButton"
            //disabled={!this.state.hasData}
            disabled={this.state.block}
            color="primary"
            variant="contained"
            onClick={()=>{
              
              this.setState({isLoading:true})
              this.setState({block:true})
            }}

            >
            Submit 
          </Button>
          {/* <DisplayApplicants hasDataCallback={this.hasDataCallback}></DisplayApplicants> */}
          {/* <DisplayApplicants></DisplayApplicants> */}

          {this.state.isLoading ? 
          // <DisplayApplicants hasDataCallback={this.hasDataCallback}></DisplayApplicants>
           <DisplayApplicants></DisplayApplicants>
          : <div></div>} 
        </div>
        
      );
    }
}
export default AdminFilesUpload;
  

