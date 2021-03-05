import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';


const apiURL = 'http://localhost:5000/api';

class AdminFilesUpload extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ApplicantsFile: null,
        InstructorsFile: null,
        semester: 'summer',
        year: 2021
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
    render() {
      return (
        <div className="uploadButtons">
            <h1>Please Upload Applicants and Inctructors Data</h1>
            Choose Applicants File: <input
              type="file"
              id="applicantData"
              accept=".xlsx, .xls, .csv"
              onChange={(e)=>this.onChangeHandler(e, 'ApplicantsFile')}
            />
          <Button className="submitButton"
            variant="contained"
            onClick={()=>this.sendFile('ApplicantsFile')}
            >
            Submit 
          </Button>
          <br/>
          <br/>
          Choose Instructors File: <input
              type="file"
              id="instructorsData"
              accept=".xlsx, .xls, .csv"
              onChange={(e)=>this.onChangeHandler(e, 'InstructorsFile')}
            />
          <Button className="submitButton"
            variant="contained"
            onClick={()=>this.sendFile('InstructorsFile')}
            >
            Submit 
          </Button>
        </div>
        
      );
    }
}
export default AdminFilesUpload;
  