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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import QuestionAnswerModal from "./QuestionAnswerModal";
import zIndex from "@material-ui/core/styles/zIndex";
import RejectTA from "./RejectTA";

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
        marginTop: 10,
    },
    tableContainer: {
        marginTop: 10,
        overflowX: "auto",
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
    // semester,
    viewApplicant,
    editPrivilege,
    setError,
}) {
    const classes = useStyles();
    const [courseState, setCourseState] = useState(course);
    const [addTaEmail, setAddTaEmail] = useState("");
    const [addTaHours, setAddTaHours] = useState("");
    const [modifiedTa, setModifiedTa] = useState("");
    const [modifiedCourse, setModifiedCourse] = useState("");
    const [oldTaHours, setOldTaHours] = useState("");
    const [modifiedTaHours, setModifiedTaHours] = useState("");
    const [open, setOpen] = useState(false);
    const [rejectionReason, setRejectionReaon] = useState("")
    const [tempRanking, setTempRanking] = useState({});

    function setRank(email, rank) {
        // for profs
        setTempRanking({ ...tempRanking, [email]: rank - 1 });
    }
    const handleClickOpen = (courseCode, TaEmail, TaHours) => {
        setModifiedCourse(courseCode)
        setModifiedTa(TaEmail)
        setOldTaHours(TaHours)
        setOpen(true);
      };

    const handleOverride = () => {
        updateTaHours()
        handleClose();
    }

    const handleClose = () => {
        setOpen(false);
      };
    
    function updateTaHours() {
        fetch(`http://localhost:5000/api/updateTaHours`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hours: modifiedTaHours,
                TaEmail: modifiedTa,
                course: modifiedCourse,
            }),
        })
            .then((response) => {
                if (response.status == "404") {
                    setError("Cannot assign new hours");
                } else {
                    const newState = { ...courseState };
                    newState["allocation_list"].filter(
                        (applicant) => applicant.email === modifiedTa
                    )[0].hours_allocated = modifiedTaHours;
                    setCourseState(newState);
                    //window.location.reload()
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function updateRank(course, email) {
        fetch(`http://localhost:5000/api/rank`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                course: course,
                email: email,
                rank: tempRanking[email],
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
                    //window.location.reload()
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const changeTAStatus = (email, status, reason) => {
        console.log(email)
        console.log(email, status)
        fetch(`http://localhost:5000/api/allocation/changeStatus/${email}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                newStatus: status,
                // semester: semester.toLowerCase().replace(/ /g, ""),
                courseName: course.course_code,
                rejectionReason: reason
            }),
        })
            .then((res) => {
                console.log(courseState)
                const newState = { ...courseState };
                newState["allocation_list"].filter(
                    (allocation) => allocation.email === email
                )[0].status = status;
                newState["allocation_list"].filter(
                    (allocation) => allocation.email === email
                )[0].rejection_reason = reason;
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
                // semester: semester.toLowerCase().replace(/ /g, ""),
                courseName: course.course_code,
                email: addTaEmail,
                hours: addTaHours,
            }),
        })
            .then((res) => {
                let newState = { ...courseState };
                newState["allocation_list"] = [
                    ...newState["allocation_list"],
                    { status: "pending", email: addTaEmail, hours_allocated: addTaHours},
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
                // semester: semester.toLowerCase().replace(/ /g, ""),
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
    <div>
        <Card className={classes.container} variant="outlined">
            <CardContent>
                <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                >
                    {/* {semester} */}
                </Typography>
                {console.log(courseState)}
                <Typography className={classes.pos} variant="h5" component="h2" gutterBottom>
                    {courseState["course_code"]}
                </Typography>
                {/*TODO this accordion should prob be put in its own component - there are 2 of them for applicants and allocations*/}
                {viewApplicant && (
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div>Applicants:</div>
                        </AccordionSummary>
                        <AccordionDetails className={classes.tableContainer}>
                            <TableContainer>
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
                                                <h3>Current Rank</h3>
                                            </TableCell>
                                            <TableCell>
                                                <h3>Update Rank</h3>
                                            </TableCell>
                                            <TableCell>
                                                <h3>See More</h3>
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
                                                            {applicant.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {applicant.fundable}
                                                        </TableCell>
                                                        <TableCell>
                                                            {applicant.profRank}
                                                        </TableCell>
                                                        <TableCell>
                                                            <NativeSelect
                                                                id="select"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setRank(
                                                                        applicant.email,
                                                                        e.target
                                                                            .selectedIndex +
                                                                            1
                                                                    );
                                                                }}
                                                            >
                                                                <option value="">
                                                                    {" "}
                                                                    Select rank
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
                                                                        applicant.email
                                                                    );
                                                                }}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <QuestionAnswerModal
                                                                questionAnswers={
                                                                    applicant.questionAnswerPairs
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                            {courseState["allocation_list"].map(
                                (allocation, index) => {
                                    return (
                                        <div key={index}>
                                            <p>Email: {allocation.email}</p>
                                            <p>Status: {allocation.status}</p>
                                            {allocation.status == "rejected" &&
                                                <p>Reason for Rejection: {allocation.rejection_reason} </p>
                                            }
                                            <p>Hours: {allocation.hours_allocated}</p>
                                            <div
                                                className={
                                                    classes.sideBySideDisplay
                                                }
                                            >
                                                <Button
                                                    onClick={() =>
                                                        changeTAStatus(
                                                            allocation.email,
                                                            "confirmed",
                                                            "N/A"
                                                        )
                                                    }
                                                >
                                                    Accept into Course
                                                </Button>
                                                <RejectTA
                                                    email = {allocation.email}
                                                    course = {courseState.course_code}
                                                    rejectionAPIcall = {changeTAStatus}
                                                >
                                        
                                                </RejectTA>
                                                   
                                            </div>
                                            {editPrivilege && (
                                                <div>
                                                    <Button
                                                        onClick={() => {
                                                            deleteTaAllocation(
                                                                allocation.email
                                                            );
                                                        }}
                                                    >
                                                        Delete TA Allocation
                                                    </Button>
                                                    <Button variant="contained" color="default" onClick={() => {handleClickOpen(courseState["course_code"], allocation.email, allocation.hours_allocated)}}>
                                                        Modify Hours
                                                    </Button>
                                                </div>
                                            )}
                                            <br></br>
                                        </div>
                                    );
                                }
                            )}
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
                        <TextField
                            label="hours"
                            value={addTaHours}
                            onChange={(event) => {
                                setAddTaHours(event.target.value);
                            }}
                        />
                        <Button
                            onClick={() => {
                                addTaAllocation();
                            }}
                            disabled={addTaEmail.length === 0 || addTaHours.length === 0}
                        >
                            Add TA Allocation
                        </Button>
                        
                    </div>
                )}
            </CardContent>
        </Card>
        <Dialog
          open={open}
          fullWidth={true}
          onClose={handleClose}
        >
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              <b>Course:</b> {modifiedCourse}
              <br />
              <br />
              <b>TA:</b> {modifiedTa}
              <br />
              <br />
              <b>Old Hours:</b> {oldTaHours}
              <br />
              <br />
              <b>New Hours:</b>
              <TextField 
                className={classes.txtField} 
                id="standard-basic" 
                value={modifiedTaHours}
                onChange={e => setModifiedTaHours(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
                className={classes.overrideBtn} variant="contained" color="primary"
                disabled={modifiedTaHours.length === 0}
                onClick={handleOverride}
            >
              Override
            </Button>
          </DialogActions>
      </Dialog>
        </div>
    );
}

// export default withStyles(styles)(CourseInfo)
