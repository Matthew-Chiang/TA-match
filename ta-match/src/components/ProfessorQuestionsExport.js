import TextField from "@material-ui/core/TextField";
import React from "react";
import { ExportCSV } from "./ExportCSV";

class ProfessorQuestionsExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            semesterInput: "",
            error: null,
            isLoaded: false,
            allQuestions: [],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleExport = () => {
        fetch(`http://localhost:5000/api/questions/${this.state.semesterInput}`)
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
                    value={this.state.semesterInput}
                    onChange={this.handleChange}
                />
                <button onClick={this.handleExport} noValidate>
                    Download Questions for Export
                </button>

                <ExportCSV
                    csvData={this.parseQuestionData()}
                    fileName={fileName}
                />

                <ul>
                    {allQuestions.map((item) => (
                        <li key={item.course}>
                            <p>
                                <b>{item.course + ": "}</b>
                            </p>
                            {item.questions.map((question) => {
                                return <p>{question}</p>;
                            })}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default ProfessorQuestionsExport;
