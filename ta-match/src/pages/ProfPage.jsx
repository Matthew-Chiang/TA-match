import CourseCard from "../components/CourseCard";
import Dashboard from "../components/Dashboard";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import Modal from "@material-ui/core/Modal";
import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const ProfPage = () => {
    const [openTaApp, setOpenTaApp] = useState(false);
    const [taQuestions, setTaQuestions] = useState([]);

    const handleQuestionTextChange = (event, index) => {
        let newQuestions = [...taQuestions];
        newQuestions[index] = event.target.value;
        setTaQuestions(newQuestions);
    };

    return (
        <div className="prof-page">
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
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <CourseCard />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CourseCard />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CourseCard />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CourseCard />
                </Grid>
            </Grid>

            <Modal
                open={openTaApp}
                onClose={() => {
                    setOpenTaApp(false);
                }}
            >
                <div style={{ backgroundColor: "white" }}>
                    <h1>Create TA Application</h1>
                    {taQuestions.map((question, index) => {
                        return (
                            <div key={index}>
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
