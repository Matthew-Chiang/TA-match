import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
    Select,
    MenuItem,
    InputLabel,
    NativeSelect,
    FormControl,
} from "@material-ui/core";

const apiURL = "http://localhost:5000/api";

const useStyles = makeStyles({
    container: {
        marginTop: 20,
    },
    table: {
        minWidth: 650,
    },
    assignBtn: {
        marginLeft: 20,
        marginTop: 10,
    },
    row: {
        backgroundColor: "#ECECEC",
    },
    formControl: {
        marginBottom: 5,
        minWidth: 140,
    },
    submitBtn: {
        marginLeft: 40,
        marginBottom: 5,
    },
});

export default function CourseInstructorAssociation({ setHoursFlag }) {
    // styles
    const classes = useStyles();
    const [instructorInfo, setInstructorInfo] = useState([]);
    const [courseInfo, setCourseInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [test, setTest] = useState(0);
    let courseMatch = [];
    let instructorMatch = [];
    let invalid = 0;
    let blockCheck = [];
    const [block, setBlock] = useState("");

    useEffect(() => {
        fetch(`${apiURL}/getInstructors`)
            .then((response) => {
                response
                    .json()
                    .then((data) => {
                        console.log(data);
                        setInstructorInfo(data);
                        if (data.length == 0) {
                            setIsLoading(true);
                            setBlock(false);
                        } else {
                            setIsLoading(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(`${apiURL}/getCourses`)
            .then((response) => {
                response
                    .json()
                    .then((data) => {
                        setCourseInfo(data);
                        console.log(data);
                        data.forEach((i) => {
                            console.log(i.ta_hours);
                            if (i.ta_hours) {
                                blockCheck.push(i.ta_hours);
                                setBlock(true);
                            }
                        });
                        console.log(blockCheck.length);
                        console.log(courseInfo);
                        console.log(courseInfo.length);
                        if (blockCheck.length == data.length) {
                            setBlock(true);
                        } else {
                            setBlock(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [test]);

    function assignInstructor() {
        if (courseMatch.length == 0) {
            alert("Please choose an instructor assignment before submitting");
        } else {
            courseInfo.map((c) => {
                if (typeof c["instructor"] === "undefined") {
                    for (let i = 0; i < courseMatch.length; i++) {
                        if (courseMatch[i] == c["course"]) {
                            invalid = 0;
                        } else {
                            invalid++;
                        }
                    }
                }
            });
            if (invalid == 0) {
                fetch(`${apiURL}/assignInstructors`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        course: courseMatch,
                        instructor: instructorMatch,
                    }),
                })
                    .then((response) => {
                        console.log(response);
                        courseMatch = [];
                        instructorMatch = [];
                        invalid = 0;
                        setTest(test + 1);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                alert(
                    "Please assign an instructor to all courses before pressing submit"
                );
            }
        }
    }

    function storeAssignments(course, instructor) {
        courseMatch.push(course);
        instructorMatch.push(instructor);
    }

    return (
        <div>
            <h3>Course-Instructor Association</h3>
            <Typography component="div">
                <Box fontStyle="italic">
                    This function will assign instructors to courses for the
                    current semester.
                    <Button
                        className={classes.submitBtn}
                        disabled={block}
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            setHoursFlag(true);
                            assignInstructor();
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Typography>

            {!isLoading ? (
                <TableContainer className={classes.container}>
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow className={classes.row}>
                                <TableCell>Course Code</TableCell>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Current Professor</TableCell>
                                <TableCell>Assign Professor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courseInfo.map((course) => {
                                console.log(course["instructor"]);
                                return (
                                    <TableRow key={course["course"]}>
                                        <TableCell>
                                            {course["course"]}
                                        </TableCell>
                                        <TableCell>
                                            {course["course_name"]}
                                        </TableCell>
                                        <TableCell>
                                            {course["instructor"]}
                                        </TableCell>
                                        <TableCell>
                                            <FormControl
                                                className={classes.formControl}
                                            >
                                                <InputLabel>
                                                    Select professor
                                                </InputLabel>
                                                <Select
                                                    defaultValue=""
                                                    id="select"
                                                    onChange={(e) => {
                                                        storeAssignments(
                                                            course["course"],
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    {instructorInfo.map(
                                                        (inst, index) => {
                                                            return (
                                                                <MenuItem
                                                                    value={
                                                                        inst[
                                                                            "email"
                                                                        ]
                                                                    }
                                                                    key={index}
                                                                >
                                                                    {
                                                                        inst[
                                                                            "email"
                                                                        ]
                                                                    }
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                            </FormControl>
                                            {/* <Button className={classes.assignBtn}
                          color="primary"
                          onClick={() => {
                            setTest(test+1)
                          }}
                      >Assign</Button> */}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <div></div>
            )}
        </div>
    );
}
