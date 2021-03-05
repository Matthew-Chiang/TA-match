import React, { Component, useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import { AccordionDetails, AccordionSummary } from "@material-ui/core";
import { Select, MenuItem, InputLabel, NativeSelect } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAuth } from "../contexts/AuthContext";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginTop: 6,
    },
    sideBySideDisplay: {
        display: "flex",
    },
});

export default function CourseInfoCard({
    course,
    semester,
    viewApplicant,
    editPrivilege,
}) {
    const classes = useStyles();
    const [courseState, setCourseState] = useState(course);
    const [addTaEmail, setAddTaEmail] = useState("");

    const changeTAStatus = (email, status) => {
        fetch(`http://localhost:5000/api/allocation/changeStatus/${email}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                newStatus: status,
                semester: semester.toLowerCase().replace(/ /g, ""),
                courseName: course.course_code,
            }),
        })
            .then((res) => {
                const newState = { ...courseState };
                newState["allocation_list"].filter(
                    (allocation) => allocation.email === email
                )[0].status = status;
                setCourseState(newState);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const addTaAllocation = () => {
        fetch(`http://localhost:5000/api/allocation/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                semester: semester.toLowerCase().replace(/ /g, ""),
                courseName: course.course_code,
                email: addTaEmail,
            }),
        })
            .then((res) => {
                let newState = { ...courseState };
                newState["allocation_list"] = [
                    ...newState["allocation_list"],
                    { status: "pending", email: addTaEmail },
                ];
                setCourseState(newState);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const deleteTaAllocation = (email) => {
        fetch(`http://localhost:5000/api/allocation/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                semester: semester.toLowerCase().replace(/ /g, ""),
                courseName: course.course_code,
                email,
            }),
        })
            .then((res) => {
                let newState = { ...courseState };
                newState["allocation_list"] = newState[
                    "allocation_list"
                ].filter((allocation) => allocation.email !== email);

                setCourseState(newState);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                >
                    University of Western Ontario
                </Typography>
                <p> {course["course_code"]} </p>
                <Typography className={classes.pos} color="textSecondary">
                    {semester}
                </Typography>
                {/*TODO this accordion should prob be put in its own component - there are 2 of them for applicants and allocations*/}
                {viewApplicant && (
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div>Applicants:</div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                {courseState["applicant_list"].map(
                                    (applicant, index) => {
                                        return (
                                            <div key={index}>
                                                {/* need to be dynamic */}
                                                <p>Name: {applicant.name}</p>
                                                <p>Email: {applicant.email}</p>
                                                <p>
                                                    Fundable:{" "}
                                                    {applicant.fundable}
                                                </p>
                                                <p>
                                                    Answer 1:{" "}
                                                    {applicant.answer1}
                                                </p>
                                                <p>
                                                    Answer 2:{" "}
                                                    {applicant.answer2}
                                                </p>
                                                <InputLabel id="label">
                                                    Rank
                                                </InputLabel>
                                                <NativeSelect id="select">
                                                    {course[
                                                        "applicant_list"
                                                    ].map(
                                                        (applicant, index) => {
                                                            return (
                                                                <option
                                                                    key={index}
                                                                >
                                                                    {index + 1}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </NativeSelect>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div>TA Allocations:</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {courseState["allocation_list"].map(
                                (allocation, index) => {
                                    return (
                                        <div key={index}>
                                            <p>Email: {allocation.email}</p>
                                            <p>Status: {allocation.status}</p>
                                            <div
                                                className={
                                                    classes.sideBySideDisplay
                                                }
                                            >
                                                <Button
                                                    onClick={() =>
                                                        changeTAStatus(
                                                            allocation.email,
                                                            "confirmed"
                                                        )
                                                    }
                                                >
                                                    Accept into Course
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        changeTAStatus(
                                                            allocation.email,
                                                            "rejected"
                                                        )
                                                    }
                                                >
                                                    Reject from Course
                                                </Button>
                                            </div>
                                            {editPrivilege && (
                                                <Button
                                                    onClick={() => {
                                                        deleteTaAllocation(
                                                            allocation.email
                                                        );
                                                    }}
                                                >
                                                    Delete TA Allocation
                                                </Button>
                                            )}
                                            <br></br>
                                        </div>
                                    );
                                }
                            )}

                            {editPrivilege && (
                                <div>
                                    <TextField
                                        value={addTaEmail}
                                        onChange={(event) => {
                                            setAddTaEmail(event.target.value);
                                        }}
                                    />
                                    <Button
                                        onClick={() => {
                                            addTaAllocation();
                                        }}
                                        disabled={addTaEmail.length === 0}
                                    >
                                        Add TA Allocation
                                    </Button>
                                </div>
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    );
}

// export default withStyles(styles)(CourseInfo)
