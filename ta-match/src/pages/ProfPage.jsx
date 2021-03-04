import Dashboard from "../components/Dashboard";
import "../App.css";
import Modal from "@material-ui/core/Modal";
import React, { useState } from "react";
import CourseInfo from "../components/CourseInfo";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const ProfPage = () => {
    const [openTaApp, setOpenTaApp] = useState(false);
    const [taQuestions, setTaQuestions] = useState([]);
    const [courseName, setCourseName] = useState("");

    const handleQuestionTextChange = (event, index) => {
        let newQuestions = [...taQuestions];
        newQuestions[index] = event.target.value;
        setTaQuestions(newQuestions);
    };

    const saveQuestions = () => {
        fetch(`http://localhost:5000/api/addQuestionsForTA`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                semester: "summer2021",
                courseName: courseName,
                questions: taQuestions,
            }),
        })
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="container">
            <Dashboard />
            <Button
                variant="contained"
                color="primary"
                className="prof-button"
                onClick={() => {
                    setOpenTaApp(true);
                }}
            >
                New TA Application
            </Button>
            <h1>Welcome, Professor!</h1>
            <h3>Your Courses:</h3>
            <CourseInfo></CourseInfo>

            <Modal
                open={openTaApp}
                onClose={() => {
                    setOpenTaApp(false);
                }}
            >
                <div style={{ backgroundColor: "white" }}>
                    <h1>Create TA Application</h1>
                    <p>Course Name: </p>
                    <TextField
                        value={courseName}
                        onChange={(event) => {
                            setCourseName(event.target.value);
                        }}
                    />
                    {taQuestions.map((question, index) => {
                        return (
                            <div key={index}>
                                <p>Question {index}:</p>
                                <TextField
                                    value={taQuestions[index]}
                                    onChange={(event) => {
                                        handleQuestionTextChange(event, index);
                                    }}
                                />
                            </div>
                        );
                    })}
                    <Button
                        onClick={() => {
                            setTaQuestions([...taQuestions, ""]);
                        }}
                    >
                        Add Question
                    </Button>
                    <Button
                        onClick={() => {
                            console.log(taQuestions);
                            saveQuestions();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ProfPage;
