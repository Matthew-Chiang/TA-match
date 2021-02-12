import TextField from '@material-ui/core/TextField';
import './App.css';
import React from 'react';
import {ExportCSV} from './ExportCSV';

  class Questions extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        input: '',
        error: null,
        isLoaded: false,
        items: []
      }
      this.handleChange = this.handleChange.bind(this);
    }

    handleExport = () => {
      console.log(this.state.input);
      fetch(`http://localhost:4200/api/questions/${this.state.input}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          })
          console.log(this.state.items);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
    }

    handleChange(event) {
      this.setState({input: event.target.value});
    }

    render() {
      const {error, isLoaded, items} = this.state;
        const fileName = "Questions";
        return (
          <div>
            <h1>Export Questions</h1>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="semester"
              label="Semester"
              name="semester"
              value={this.state.input}
              onChange={this.handleChange}
            />
            <button onClick={this.handleExport} noValidate>Download Questions for Export</button>

            <ExportCSV csvData={this.state.items} fileName={fileName} />

            <ul>
              {items.map(item => (
                <li key={item.course}>
                  <p><b>{item.course + ": "}</b></p>
                  <p>{item.question1}</p>
                  <p>{item.question2}</p>
                  <p>{item.question3}</p>
                </li>
              ))}
            </ul>
            
          </div>
        )      
    }
  }
export default Questions;
