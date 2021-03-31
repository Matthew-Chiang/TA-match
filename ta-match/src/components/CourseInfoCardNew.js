import React, { Component, useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Toolbar, IconButton, Slide } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonIcon from '@material-ui/icons/Person';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Alert from '@material-ui/lab/Alert';

import logo from "../uwo.png"

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
        color: "grey",
        marginTop: 3
    },
    pos: {
        fontSize: 18,
        marginTop: 3,
        fontWeight: "bold"
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
    cell: {
        '&:last-child': {
            paddingBottom: 16
        }
    },
    logo: {
        float: "left",
        height: 50,
        width: "auto",
        marginRight: 15
    },
    moreBtn: {
        float: "right",
        marginTop: 5
    },
    icons: {
        color: "grey",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
    },
    container: {
        marginTop: 20,
    },
    table: {
        minWidth: 650,
    },
    row: {
        backgroundColor: "#ECECEC"
    },
    dialogContainer: {
        margin: 120,
        marginTop: 20,
        marginBottom: 20
    },
    dName: {
        color: "grey"
    },
    dCode: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 15
    },
    dHrs: {
        float: "right",
        marginTop: 20,
        marginBottom: 15
    },
    noTa: {
        width: 100,
        height: 100
    },
    subtitle: {
        marginTop: 20,
        marginBottom: 20,
        fontWeight: "bold",
        fontSize: 18
    },
    allocateTxtField: {
        marginRight: 10
    },
    formControl: {
        marginRight: 10,
        minWidth: 200,
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function CourseInfoCard({
    course,
    // semester,
    viewApplicant,
    editPrivilege,
    // setError,
}) {
    const classes = useStyles();
    const [courseState, setCourseState] = useState(course);
    const [addTaName, setAddTaName] = useState("");
    const [addTaEmail, setAddTaEmail] = useState("");
    const [addTaHours, setAddTaHours] = useState("");
    const [modifiedTa, setModifiedTa] = useState("");
    const [modifiedCourse, setModifiedCourse] = useState("");
    const [oldTaHours, setOldTaHours] = useState("");
    const [modifiedTaHours, setModifiedTaHours] = useState("");
    const [open, setOpen] = useState(false);
    const [tempRanking, setTempRanking] = useState({});

    const [openCoursePopup, setCoursePopup] = useState(false);
    const [error, setError] = useState("");
    const [rejectModal, setRejectModal] = useState(false);
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")

    const handlePopupOpen = () => {
        setCoursePopup(true);
    };
    
    const handlePopupClose = () => {
        setCoursePopup(false);
    };

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
        setModifiedTaHours("")
        setOpen(false);
    };

    const handleRejectOpen = (email) => {
        setRejectModal(true);
        setEmail(email);
    }

    const handleRejectClose = () => {
        setRejectModal(false);
    }

    const handleRejectOverride = () => {
        changeTAStatus(email,"rejected",description);
        handleRejectClose();
    }
    
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
                    setError("Total hours assigned must not exceed number of TA hours");
                } else {
                    const newState = { ...courseState };
                    newState["allocation_list"].filter(
                        (applicant) => applicant.email === modifiedTa
                    )[0].hours_allocated = modifiedTaHours;
                    setCourseState(newState);
                    setError("")
                    //window.location.reload()
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const changeTAStatus = (email, status, reason) => {
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
            <CardContent className={classes.cell}>
                <Grid container>
                    <Grid item xs={1}>
                        <img className={classes.logo} src={logo} />
                    </Grid>
                    <Grid item xs={5}>
                        <Typography className={classes.pos} variant="h5" component="h2">
                            {courseState["course_code"]}: <span style={{fontWeight: "normal"}}>{courseState["course_name"]}</span>
                        </Typography>
                        <Typography className={classes.title} variant="h5" component="h2">
                        Professor: {courseState["instructor"]} 
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.icons}>
                        <ScheduleIcon style={{marginRight: 5}}/> 
                        <span style={{marginRight: 20, fontSize: 14}}>{courseState["ta_hours"]} TA Hours</span>
                        <PersonIcon style={{marginRight: 5}}/>
                        <span style={{fontSize: 14}}>{courseState.allocation_list.length} Allocations</span>
                    </Grid>
                    <Grid item xs={2}>
                    <Button
                        className={classes.moreBtn}
                        variant="contained"
                        onClick={handlePopupOpen}
                    >Manage
                    </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        {"allocation_list" in courseState && courseState.allocation_list.length > 0 ? (
            <Dialog fullScreen open={openCoursePopup} onClose={handlePopupClose} TransitionComponent={Transition} className={classes.dialogFull}>
        <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handlePopupClose} aria-label="close">
                <CloseIcon />
                </IconButton>
            </Toolbar>
            <div className={classes.dialogContainer}>
                <Typography className={classes.dName}>Professor: {courseState["instructor"]}</Typography>
                <Typography className={classes.dHrs}><span style={{fontWeight:"bold"}}>Number of TA Hours:</span> {courseState["ta_hours"]}</Typography>
                <Typography className={classes.dCode}>{courseState["course_code"]}: <span style={{fontWeight: "normal"}}>{courseState["course_name"]}</span></Typography>
                <Divider/>
                <Typography className={classes.subtitle}>
                    TA Allocations
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TableContainer className={classes.container}>
                        <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow className={classes.row}>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Fundability</TableCell>
                            <TableCell>Hours Assigned</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
            {courseState["allocation_list"].map((allocation, index) => {
                return (
                    <TableRow key={index}>
                    <TableCell>{allocation.name}</TableCell>
                    <TableCell>{allocation.email}</TableCell>
                    <TableCell>{allocation.fundability == 1 ? "Fundable" : allocation.fundability == 2 ? "Non-fundable" : "External"}</TableCell>
                    <TableCell>{allocation.hours_allocated}</TableCell>
                    <TableCell align="right">
                        {editPrivilege && (
                        <Button
                            color="default"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => {
                                handleClickOpen(courseState["course_code"],allocation.email,allocation.hours_allocated)
                            }}
                        >
                            Modify
                        </Button>
                        )}
                    </TableCell>
                    <TableCell>{allocation.status}</TableCell>
                    <TableCell>
                    {allocation.status == "rejected" &&
                    <p>Reason for Rejection: {allocation.rejection_reason} </p>
                    }
                    </TableCell>
                    <TableCell align="right">
                        <Button
                            color="primary"
                            size="small"
                            style={{marginLeft: 10}}
                            startIcon={<ThumbUpIcon />}
                            onClick={() => {changeTAStatus(allocation.email,"confirmed","N/A")}}
                        >
                            Accept
                        </Button>
                        <Button
                            color="secondary"
                            size="small"
                            style={{marginLeft: 10}}
                            startIcon={<ThumbDownIcon />}
                            onClick={() => handleRejectOpen(allocation.email)}
                        > 
                            Reject
                        </Button>
                        {editPrivilege && (
                        <Button
                            color="default"
                            size="small"
                            style={{marginLeft: 10}}
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                deleteTaAllocation(allocation.email)
                            }}
                        >
                            Delete
                        </Button>
                        )}
                    </TableCell>
                </TableRow>
                )
            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {editPrivilege && (
                    <div>
                        <Typography className={classes.subtitle}>
                            Manually Allocate TA's
                        </Typography>
                        <TextField className={classes.allocateTxtField}
                            variant="outlined"
                            label="Name"
                            size="small"
                            value={addTaName}
                            onChange={(event) => {
                                setAddTaName(event.target.value);
                            }}
                        />
                        <TextField className={classes.allocateTxtField}
                            variant="outlined"
                            label="Email"
                            size="small"
                            value={addTaEmail}
                            onChange={(event) => {
                                setAddTaEmail(event.target.value);
                            }}
                        />
                        {/* <FormControl className={classes.formControl} variant="outlined" size="small">
                        <InputLabel id="demo-simple-select-outlined-label">Fundability</InputLabel>
                        <Select defaultValue="" id="demo-simple-select-outlined"
                            // onChange={(e) => {
                            //     assignInstructor(course["course"],e.target.value)
                            // }}
                            >
                            <MenuItem value="">Select fundability</MenuItem>
                            <MenuItem value={1} key={1}>Fundable</MenuItem>
                            <MenuItem value={2} key={2}>Non-fundable</MenuItem>
                            <MenuItem value={3} key={3}>External</MenuItem>
                        </Select>
                        </FormControl>   */}
                        <TextField className={classes.allocateTxtField}
                            variant="outlined"
                            label="Hours"
                            size="small"
                            value={addTaHours}
                            onChange={(event) => {
                                setAddTaHours(event.target.value);
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{marginTop: 2}}
                            onClick={() => {
                                addTaAllocation();
                            }}
                            disabled={addTaEmail.length === 0 || addTaHours.length === 0}
                        >
                            Add TA Allocation
                        </Button>
                        
                    </div>
                )}
            </div>
        </Dialog>
        ) : (
            <Dialog open={openCoursePopup} onClose={handlePopupClose}>
               <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        No TAs have been allocated yet.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        )}
        
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

      <Dialog
          open={rejectModal}
          fullWidth={true}
          onClose={handleRejectClose}
        >
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              <b>Course:</b> {courseState.course_code}
              <br />
              <br />
              <b>Reason for Rejection:</b>
              <TextField 
              className={classes.txtField} 
              id="standard-basic" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.overrideBtn} disabled={description.length === 0} onClick={handleRejectOverride} variant="contained" color="primary">
              Submit Rejection
            </Button>
          </DialogActions>
      </Dialog>
        </div>
    );
}
