import Dashboard from "../components/Dashboard";
import "../App.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useState } from "react";
import CourseInfo from "../components/CourseInfo";
import { AuthContext } from "../contexts/AuthContext";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { NativeSelect } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../firebase";

const ProfPage = () => {
    const userContext = React.useContext(AuthContext);

    const [openTaApp, setOpenTaApp] = useState(false);
    const [taQuestions, setTaQuestions] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [oldQuestions, setOldQuestions] = useState([]);
    const [currentCourseList, setCurrentCourseList] = useState([]);

    const useStyles = makeStyles((theme) => ({
        btn: {
            float: "right",
            marginTop: 20,
        },
        dialogTitle: {
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
        },
        dialogContainer: {
            paddingLeft: "70px",
        },
        addQuestionBtn: {
            marginTop: "20px",
        },
    }));

    const classes = useStyles();

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
        fetch(
            `http://localhost:5000/api/pastQuestions/${
                userContext.currentUser ? userContext.currentUser.email : ""
            }`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )
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

        fetch(
            `http://localhost:5000/api/getApplicantData/${
                userContext.currentUser ? userContext.currentUser.email : ""
            }`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )
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
            {userContext.currentUser && (
                <div>
                    <Dashboard role="professor" />
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
                    <h1>
                        Welcome,{" "}
                        <span style={{ fontWeight: "normal" }}>Professor!</span>
                    </h1>
                    <h3>Your Courses:</h3>
                    <CourseInfo
                        email={
                            userContext.currentUser
                                ? userContext.currentUser.email
                                : ""
                        }
                    ></CourseInfo>
                    <Dialog
                        open={openTaApp}
                        onClose={() => {
                            setOpenTaApp(false);
                        }}
                        fullWidth={true}
                        maxWidth="md"
                    >
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setOpenTaApp(false);
                                }}
                                color="primary"
                            >
                                Close
                            </Button>
                        </DialogActions>
                        <div style={{ backgroundColor: "white" }}>
                            <DialogTitle>
                                <h1 className={classes.dialogTitle}>
                                    Create TA Application
                                </h1>
                            </DialogTitle>
                            <DialogContent className={classes.dialogContainer}>
                                <p>Course Name: </p>

                                <NativeSelect
                                    id="select"
                                    onChange={(e) => {
                                        setCourseName(e.target.value);
                                    }}
                                >
                                    <option value=""> Select course</option>
                                    {currentCourseList.map(
                                        (currentCourse, index) => {
                                            return (
                                                <option key={index}>
                                                    {currentCourse.course_code}
                                                </option>
                                            );
                                        }
                                    )}
                                </NativeSelect>
                                {taQuestions.map((question, index) => {
                                    return (
                                        <div key={index}>
                                            <p>Question {index + 1}:</p>
                                            <TextField
                                                value={taQuestions[index]}
                                                onChange={(event) => {
                                                    handleQuestionTextChange(
                                                        event,
                                                        index
                                                    );
                                                }}
                                            />
                                            <p>OR select a previous question</p>

                                            <NativeSelect
                                                id="select"
                                                onChange={(e) => {
                                                    handleQuestionTextChange(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    {" "}
                                                    Select question
                                                </option>
                                                {oldQuestions.map(
                                                    (question, index) => {
                                                        return (
                                                            <option key={index}>
                                                                {question}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </NativeSelect>
                                        </div>
                                    );
                                })}
                                <Button
                                    className={classes.addQuestionBtn}
                                    onClick={() => {
                                        setTaQuestions([...taQuestions, ""]);
                                    }}
                                >
                                    Add Question
                                </Button>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        console.log(taQuestions);
                                        saveQuestions();
                                    }}
                                >
                                    Save
                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </div>
            )}
        </div>
    );
};

export default ProfPage;
