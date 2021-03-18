import Dashboard from "../components/Dashboard";
import "../App.css";
import Modal from "@material-ui/core/Modal";
import React, { useState } from "react";
import CourseInfo from "../components/CourseInfo";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { NativeSelect } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    btn: {
        float: "right",
        marginTop: 20
    }
  }));

const ProfPage = () => {
    const classes = useStyles();

    const [openTaApp, setOpenTaApp] = useState(false);
    const [taQuestions, setTaQuestions] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [oldQuestions, setOldQuestions] = useState([]);
    const [currentCourseList, setCurrentCourseList] = useState([]);

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

    const getOldQuestions = () => {
        // hardcoded to john
        fetch(`http://localhost:5000/api/pastQuestions/${"john@uwo.ca"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                console.log(res);
                res.json()
                    .then((data) => {
                        setOldQuestions(data);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getAllSemesters = () => {
        // we prob do this call elsewhere in the flow
        // in the future, we should refactor this behaviour so that this data is only called once
        // hardcoded to john
        fetch(`http://localhost:5000/api/getApplicantData/${"john@uwo.ca"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                console.log(res);
                res.json()
                    .then((data) => {
                        setCurrentCourseList(data.courseList);
                        console.log(data.courseList);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="container">
            <Dashboard role="professor"/>
            <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={() => {
                    setOpenTaApp(true);
                    getOldQuestions();
                    getAllSemesters();
                }}
            >
                New TA Application
            </Button>
            <h1>Welcome, <span style={{fontWeight: "normal"}}>Professor!</span></h1>
            <h3>Your Courses:</h3>
            <CourseInfo email="john@uwo.ca"></CourseInfo>

            <Modal
                open={openTaApp}
                onClose={() => {
                    setOpenTaApp(false);
                }}
               >
                <div style={{ backgroundColor: "white" }}>
                    <h1>Create TA Application</h1>
                    <p>Course Name: </p>

                    <NativeSelect
                        id="select"
                        onChange={(e) => {
                            setCourseName(e.target.value);
                        }}
                    >
                        <option value=""> Select course</option>
                        {currentCourseList.map((currentCourse, index) => {
                            return (
                                <option key={index}>
                                    {currentCourse.course_code}
                                </option>
                            );
                        })}
                    </NativeSelect>
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
                                <p>OR select a previous question</p>

                                <NativeSelect
                                    id="select"
                                    onChange={(e) => {
                                        handleQuestionTextChange(e, index);
                                    }}
                                >
                                    <option value=""> Select question</option>
                                    {oldQuestions.map((question, index) => {
                                        return (
                                            <option key={index}>
                                                {question}
                                            </option>
                                        );
                                    })}
                                </NativeSelect>
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
