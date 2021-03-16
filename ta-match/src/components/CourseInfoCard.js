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

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
    root: {
        //minWidth: 275
        width: 800,
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
    container: {
        marginTop: 20,
    },
    table: {
        minWidth: 1000,
    },
    dialogText: {
        fontSize: 18,
    },
    txtField: {
        marginLeft: 10,
    },
    overrideBtn: {
        marginRight: 20,
        marginBottom: 10,
    },
});

export default function CourseInfoCard({
    course,
    semester,
    viewApplicant,
    editPrivilege,
    setError,
}) {
    const classes = useStyles();
    const [courseState, setCourseState] = useState(course);
    const [addTaEmail, setAddTaEmail] = useState("");
    const [tempRanking, setTempRanking] = useState({});

    function setRank(email, rank) {
        // for profs
        setTempRanking({ ...tempRanking, [email]: rank - 1 });
    }

    function updateRank(course, email, sem) {
        fetch(`http://localhost:5000/api/rank`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                course: course,
                email: email,
                rank: tempRanking[email],
                sem: sem,
            }),
        })
            .then((response) => {
                if (response.status == "404") {
                    setError("Cannot assign same rank to multiple applicants");
                } else {
                    const newState = { ...courseState };
                    newState["applicant_list"].filter(
                        (applicant) => applicant.email === email
                    )[0].profRank = tempRanking[email];
                    setCourseState(newState);
                    console.log(response);
                    //window.location.reload()
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

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
        <Card className={classes.container} variant="outlined">
            {console.log(courseState)}
            <CardContent>
                <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                >
                    University of Western Ontario
                </Typography>
                <p> {courseState["course_code"]} </p>
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
                                <TableContainer className={classes.container}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <h3>Name</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <h3>Email</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <h3>Fundable</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <h3>Answer 1</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <h3>Answer 2</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <h3>Current Rank</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <h3>Update Rank</h3>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {courseState["applicant_list"].map(
                                                (applicant, index) => {
                                                    if (!applicant.profRank) {
                                                        applicant.profRank =
                                                            "Unranked";
                                                    }
                                                    return (
                                                        <TableRow
                                                            key={
                                                                courseState[
                                                                    "course"
                                                                ]
                                                            }
                                                        >
                                                            <TableCell>
                                                                {applicant.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    applicant.email
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    applicant.fundable
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    applicant.answer1
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    applicant.answer2
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    applicant.profRank
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <NativeSelect
                                                                    id="select"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setRank(
                                                                            applicant.email,
                                                                            e
                                                                                .target
                                                                                .selectedIndex +
                                                                                1
                                                                        );
                                                                    }}
                                                                >
                                                                    <option value="">
                                                                        {" "}
                                                                        Select
                                                                        rank
                                                                    </option>
                                                                    {courseState[
                                                                        "applicant_list"
                                                                    ].map(
                                                                        (
                                                                            applicant,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {index +
                                                                                        1}
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </NativeSelect>
                                                                <Button
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        updateRank(
                                                                            courseState[
                                                                                "course_code"
                                                                            ],
                                                                            applicant.email,
                                                                            "summer2021"
                                                                        );
                                                                    }}
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
                {"allocation_list" in courseState &&
                courseState.allocation_list.length > 0 ? (
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
                                                <p>
                                                    Status: {allocation.status}
                                                </p>
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
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ) : (
                    <Typography>No TAs have been allocated yet.</Typography>
                )}

                {editPrivilege && (
                    <div>
                        <br />
                        <Typography variant="h6">
                            Manually Allocate TA's
                        </Typography>
                        <TextField
                            label="email"
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
            </CardContent>
        </Card>
    );
}

// export default withStyles(styles)(CourseInfo)
