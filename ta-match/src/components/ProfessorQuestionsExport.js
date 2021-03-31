import React from "react";
import { ExportCSV } from "./ExportCSV";
import {FormControl, InputLabel, Select, MenuItem, Button} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    btn: {
        margin: theme.spacing(2.5),
    },
    table: {
        minWidth: 650,
      },
      container: {
        marginTop: 20,
      },
})

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

        const {classes} = this.props;
         
        return (
            <div>
                <h3>Export Questions</h3>
                <FormControl className={classes.formControl} >
                <InputLabel>Semester</InputLabel>
                <Select value={this.state.semester} onChange={this.handleSemester}>
                    <MenuItem value="summer">Summer</MenuItem>
                    <MenuItem value="fall">Fall</MenuItem>
                    <MenuItem value="winter">Winter</MenuItem>
                </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                <InputLabel>Year</InputLabel>
                <Select value={this.state.year} onChange={this.handleYear}>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2019">2019</MenuItem>
                    <MenuItem value="2018">2018</MenuItem>
                    <MenuItem value="2017">2017</MenuItem>
                </Select>
                </FormControl>

                <Button className={classes.btn} 
                    onClick={() => {
                        this.handleExport(); 
                        this.props.setUplaodFlag(true)}}
                    // onClick={this.handleExport} 
                    color="primary" 
                    variant="contained">
                    View Questions for Export
                </Button>
                {isLoaded ? <TableContainer className={classes.container}>
                    <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Questions</TableCell>
                        <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {allQuestions.map((item, index) => {
                        return (
                            <TableRow key={item.course+index}>
                            <TableCell component="th" scope="row">{item.course}</TableCell>
                            <TableCell >
                            {item.questions.map((question, index) => {
                                return(
                                <div>
                                    <li style={{listStyleType: 'none'}}key={index}>{question}</li>

                                </div>
                                )
                                 })}
                            </TableCell>
                           
                            <TableCell align="right">
                            </TableCell>
                        </TableRow>
                        )
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                : <div></div>}
                <br></br>
               
                <ExportCSV
                    csvData={this.parseQuestionData()}
                    fileName={fileName}
                />

            </div>
        );
    }
}
export default withStyles(styles)(ProfessorQuestionsExport);
