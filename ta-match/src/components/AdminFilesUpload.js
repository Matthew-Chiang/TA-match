import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const apiURL = 'http://localhost:5000/api';

class AdminFilesUpload extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        applicantsFile: null,
        instructorsFile: null
      }
    }
  
    onChangeHandler(event){
      console.log(event.target.files[0]);
      this.setState({
        applicantsFile: event.target.files[0]
      });
    }
  
    sendFile(filename){
      console.log(filename);
      const data = new FormData();
      data.append(filename, this.state.applicantsFile);
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
              onChange={this.onChangeHandler.bind(this)}
            />
          <Button className="submitButton"
            variant="contained"
            onClick={()=>this.sendFile.bind(this)('ApplicantsFile')}
            >
            Submit 
          </Button>
          <br/>
          <br/>
          Choose Instructors File: <input
              type="file"
              id="instructorsData"
              accept=".xlsx, .xls, .csv"
              onChange={this.onChangeHandler.bind(this)}
            />
          <Button className="submitButton"
            variant="contained"
            onClick={()=>this.sendFile.bind(this)('InstructorsFile')}
            >
            Submit 
          </Button>
        </div>
      );
    }
}
export default AdminFilesUpload;
  