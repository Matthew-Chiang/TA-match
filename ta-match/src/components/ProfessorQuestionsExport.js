import TextField from "@material-ui/core/TextField";
import React from "react";
import { ExportCSV } from "./ExportCSV";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, makeStyles } from '@material-ui/core/styles';

class ProfessorQuestionsExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            semesterInput: "",
            year: "",
            semester: "",
            error: null,
            isLoaded: false,
            allQuestions: [],
            margin: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSemester = (event) => {
        this.setState({ semester: event.target.value });
    }

    handleYear = (event) => {
        this.setState({ year: event.target.value });
    }

    handleExport = () => {
        fetch(`http://localhost:5000/api/questions/${this.state.semester}${this.state.year}`)
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        allQuestions: result,
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                    });
                }
            );
    };

    handleChange(event) {
        this.setState({ semesterInput: event.target.value });
    }

    parseQuestionData = () => {
        let parsedInput = this.state.allQuestions;
        // maps an array of questions to question 1, question 2 ...
        return parsedInput.map((course) => {
            let parsedCourse = {
                course: course.course,
                count: course.questions.length,
            };
            course.questions.forEach((question, index) => {
                const columnName = "question" + (index + 1);
                parsedCourse = { ...parsedCourse, [columnName]: question };
            });
            delete parsedCourse.questions;
            return parsedCourse;
        });
    };

    render() {
        const { error, isLoaded, allQuestions } = this.state;
        const fileName = "Questions";
        const useStyles = makeStyles((theme) => ({
              margin: theme.spacing(1),
              minWidth: 120,
          }))
         
        return (
            <div>
                <h1>Export Questions</h1>
                <FormControl className={useStyles} >
                <InputLabel>Semester</InputLabel>
                <Select value={this.state.semester} onChange={this.handleSemester}>
                    <MenuItem value="summer">Summer</MenuItem>
                    <MenuItem value="fall">Fall</MenuItem>
                    <MenuItem value="winter">Winter</MenuItem>
                </Select>
                </FormControl>
                <br></br>
                <FormControl margin='normal' ml={5}>
                <InputLabel>Year</InputLabel>
                <Select margin='dense' value={this.state.year} onChange={this.handleYear}>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2019">2019</MenuItem>
                    <MenuItem value="2018">2018</MenuItem>
                    <MenuItem value="2017">2017</MenuItem>
                </Select>
                </FormControl>
                {/* <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="semester"
                    label="Semester"
                    name="semester"
                    value={this.state.semesterInput}
                    onChange={this.handleChange}
                /> */}
                <br></br>
                <button onClick={this.handleExport} noValidate>
                    View Questions for Export
                </button>

                <ul>
                    {allQuestions.map((item, index) => (
                        <li key={item.course + index}>
                            <p>
                                <b>{item.course + ": "}</b>
                            </p>
                            {item.questions.map((question, index) => {
                                return <p key={index}>{question}</p>;
                            })}
                        </li>
                    ))}
                </ul>

                <ExportCSV
                    csvData={this.parseQuestionData()}
                    fileName={fileName}
                />
            </div>
        );
    }
}
export default ProfessorQuestionsExport;
