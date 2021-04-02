import React, { useState, useRef, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl, FormGroup, FormControlLabel, Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Toolbar, IconButton, Slide } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonIcon from '@material-ui/icons/Person';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Alert from '@material-ui/lab/Alert';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';


import logo from "../uwo.png"
import QuestionAnswerModal from "./QuestionAnswerModal";

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
        marginBottom: 50
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
        marginTop: 0,
        marginBottom: 60
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
    },
    formControlSelect: {
        marginTop: 4,
        minWidth: 100
    },
    rankBtn: {
        marginLeft: 20,
        marginTop: 4,
    },
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
    const [addTaFundability, setAddTaFundability] = useState("");
    const [modifiedTa, setModifiedTa] = useState("");
    const [modifiedCourse, setModifiedCourse] = useState("");
    const [oldTaHours, setOldTaHours] = useState("");
    const [modifiedTaHours, setModifiedTaHours] = useState("");
    const [open, setOpen] = useState(false);
    const [tempRanking, setTempRanking] = useState({});
    const [tempApp, setTempApp] = useState("");
    const [tempApp2, setTempApp2] = useState("");
    // const [tempApp3, setTempApp3] = useState("");
    // const [tempApp4, setTempApp4] = useState("");
    let tempApp3, tempApp4, tempApp5, tempApp6, tempApp7;

    const [openCoursePopup, setCoursePopup] = useState(false);
    const [openAllocPopup, setAllocPopup] = useState(false);
    const [error, setError] = useState("");
    const [rejectModal, setRejectModal] = useState(false);
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [fundableFilter, setFundableFilter] = useState(0)
    const [experienceFilter, setExperienceFilter] = useState(0)
    
    const labelRef = useRef()
    const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0

    const handlePopupOpen = () => {
        setCoursePopup(true);
    };

    const handleAllocPopupOpen = () => {
        setAllocPopup(true);
    };
    
    const handlePopupClose = () => {
        setCoursePopup(false);
    };

    const handleAllocClose = () => {
        setAllocPopup(false);
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
        setDescription("")
        setRejectModal(false);
    }

    const handleRejectOverride = () => {
        changeTAStatus(email,"Rejected",description);
        handleRejectClose();
    }
    const handleFundableFilterChange = (event) => {
        setFundableFilter(event.target.value);
      };
      const handleExperienceFilterChange = (event) => {
        setExperienceFilter(event.target.value);
      };

      
    
    const testingChange = (event) => {
        setTempApp({ ...tempApp, [event.target.value]: event.target.checked });
        //setTempApp(event.target.value)
      };
      const testingChange2 = (event) => {
        setTempApp2({ ...tempApp2, [event.target.value]: event.target.checked });
        //setTempApp2(event.target.value)
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
                name: addTaName,
                email: addTaEmail,
                hours: addTaHours,
                fundability: addTaFundability
            }),
        })
            .then((res) => {
                if (res.status == "404") {
                    setError("Total hours assigned must not exceed number of TA hours");
                } 
                else {
                    let newState = { ...courseState };
                    newState["allocation_list"] = [
                        ...newState["allocation_list"],
                        { status: "Pending", name: addTaName, email: addTaEmail, hours_allocated: addTaHours, fundability: addTaFundability},
                    ];
                    setCourseState(newState);
                    setAddTaName("");
                    setAddTaEmail("");
                    setAddTaFundability("");
                    setAddTaHours("")
                }
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

    function setRank(email, rank) {
        // for profs
        console.log(email)
        console.log(rank)
        setTempRanking({ ...tempRanking, [email]: rank});
    }

    function updateRank(course, email) {
        console.log(tempRanking[email])
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
                    //setError("Cannot assign same rank to multiple applicants");
                    alert("Cannot assign same rank to multiple applicants");
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

    return (
    <div>
        <Card className={classes.container} variant="outlined">
            <CardContent className={classes.cell}>
                <Grid container>
                    <Grid item xs={1}>
                        <img className={classes.logo} src={logo} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.pos} variant="h5" component="h2">
                            {courseState["course_code"]}: <span style={{fontWeight: "normal"}}>{courseState["course_name"]}</span>
                        </Typography>
                        <Typography className={classes.title} variant="h5" component="h2">
                        Professor: {courseState["instructor"]} 
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.icons}>
                    {!editPrivilege && (
                        <div>
                        <FolderSharedIcon style={{marginRight: 5}}/> 
                        <span style={{marginRight: 20, fontSize: 14}}>{courseState.applicant_list.length} Applicants</span>
                            </div>
                        )}
                    
                        <div>
                        <ScheduleIcon style={{marginRight: 5}}/> 
                        <span style={{marginRight: 20, fontSize: 14}}>{courseState["ta_hours"]} TA Hours</span>
                        </div>  
                        <div>
                        <PersonIcon style={{marginRight: 5}}/>
                        <span style={{fontSize: 14}}>{courseState.allocation_list.length} Allocations</span>
                        </div>
                        
                    </Grid>
                    <Grid item xs={2}>
                    {!editPrivilege &&(
                        <Button
                        disabled={courseState.allocation_list.length !== 0}
                        className={classes.moreBtn}
                        variant="contained"
                        onClick={handlePopupOpen}
                    >Applicants
                    </Button>
                    )}
                    
                    </Grid>
                    <Grid item xs={2}>
                    <Button
                        className={classes.moreBtn}
                        variant="contained"
                        onClick={handleAllocPopupOpen}
                    >Allocations
                    </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        {"allocation_list" in courseState &&
            <Dialog fullScreen open={openAllocPopup} onClose={handleAllocClose} TransitionComponent={Transition} className={classes.dialogFull}>
        <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleAllocClose} aria-label="close">
                <CloseIcon />
                </IconButton>
            </Toolbar>
            <div className={classes.dialogContainer}>
                <Typography className={classes.dName}>Professor: {courseState["instructor"]}</Typography>
                <Typography className={classes.dHrs}><span style={{fontWeight:"bold"}}>Number of TA Hours:</span> {courseState["ta_hours"]}</Typography>
                <Typography className={classes.dCode}>{courseState["course_code"]}: <span style={{fontWeight: "normal"}}>{courseState["course_name"]}</span></Typography>
                <Divider/>
                {error && <Alert severity="error">{error}</Alert>}
                <Typography className={classes.subtitle}>
                    TA Allocations
                </Typography>
                {courseState.allocation_list.length == 0 ? (
                    <Typography>
                        <Box fontStyle="italic" >
                            No TAs have been allocated to this course yet.
                        </Box>
                    </Typography>):(
                <TableContainer className={classes.tableContainer}>
                        <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow className={classes.row}>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Fundability</TableCell>
                            <TableCell>Hours Assigned</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
            {courseState["allocation_list"].map((allocation, index) => {
                console.log(courseState)
                
                return (
                    <TableRow key={index}>
                    <TableCell>{allocation.name}</TableCell>
                    <TableCell>{allocation.email}</TableCell>
                    <TableCell>{allocation.fundability == 1 ? "Fundable" : allocation.fundability == 2 ? "Non-fundable" : "External"}</TableCell>
                    <TableCell>
                        {allocation.hours_allocated}     
                        {editPrivilege && (
                        <Button
                            color="default"
                            size="small"
                            startIcon={<EditIcon />}
                            style={{float: "right"}}
                            onClick={() => {
                                handleClickOpen(courseState["course_code"],allocation.email,allocation.hours_allocated)
                            }}
                        >
                            Modify
                        </Button>
                        )}               
                    </TableCell>
                    <TableCell>{allocation.status}
                    {allocation.status == "Rejected" &&
                    <span style={{fontStyle: "italic"}}> (Reason: {allocation.rejection_reason})</span>
                    }
                    </TableCell>
                    

                    <TableCell align="right">
                        {(allocation.status == "Pending" || allocation.status == "Rejected") &&
                            <Button
                            color="primary"
                            size="small"
                            style={{marginLeft: 10}}
                            startIcon={<ThumbUpIcon />}
                            onClick={() => {changeTAStatus(allocation.email,"Confirmed","N/A")}}
                            >
                                Accept
                            </Button>
                        }
                        {(allocation.status == "Pending" || allocation.status == "Confirmed") &&
                            <Button
                            color="secondary"
                            size="small"
                            style={{marginLeft: 10}}
                            startIcon={<ThumbDownIcon />}
                            onClick={() => handleRejectOpen(allocation.email)}
                            > 
                                Reject
                            </Button>
                        }
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
                    {courseState["applicant_list"].map((a)=>{
                        if(a.email==allocation.email ){
                            return(
                                <TableCell align="right">
                                    <QuestionAnswerModal questionAnswers={a.questionAnswerPairs} />
                                </TableCell>
                            )
                        }
                    })}
                </TableRow>
                )
            })}
                        </TableBody>
                    </Table>
                </TableContainer>)}
                {editPrivilege && (
                    <div>
                        <Typography className={classes.subtitle}>
                            Manually Allocate TAs
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
                        <FormControl className={classes.formControl} variant="outlined" size="small">
                        <InputLabel ref={labelRef}>Fundability</InputLabel> 
                        <Select defaultValue="" labelWidth={labelWidth}
                            onChange={(event) => {
                                setAddTaFundability(event.target.value);
                            }}
                            >
                            <MenuItem value="">Select fundability</MenuItem>
                            <MenuItem value={1} key={1}>Fundable</MenuItem>
                            <MenuItem value={2} key={2}>Non-fundable</MenuItem>
                            <MenuItem value={3} key={3}>External</MenuItem>
                        </Select>
                        </FormControl>  
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
        </Dialog>}

{"applicant_list" in courseState && courseState.applicant_list.length > 0 ? (
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
                {error && <Alert severity="error">{error}</Alert>}
                {viewApplicant && (
                    <div>
                    <Typography className={classes.subtitle}>
                        Applicants
                    </Typography>
                        
                    {/* <Card className={classes.container} variant="outlined">
                    <CardContent className={classes.cell}>
                        <Grid container>
                            <Grid item xs={1}>
                            <InputLabel>Status</InputLabel>
                            </Grid>
                            <Grid item xs={1.5}>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox value={1} onChange={testingChange} />}
                                label="Fundable"
                            />
                            {console.log(tempApp)}
                            </FormGroup>
                            </Grid>
                            <Grid item xs={1.5}>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox value={2} onChange={testingChange} />}
                                label="Non-fundable"
                            />
                            </FormGroup>
                            </Grid>
                            <Grid item xs={2}>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox value={3} onChange={testingChange}/>}
                                label="External"
                            />
                            </FormGroup>
                            </Grid>
                            <Grid item xs={2}>
                                <InputLabel>Experience Level</InputLabel>
                            </Grid>
                            <Grid item xs={1.5}>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox value={1} onChange={testingChange2} />}
                                label="Experienced"
                            />
                            </FormGroup>
                            </Grid>
                            <Grid item xs={0}>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox value={2} onChange={testingChange2} />}
                                label="New"
                            />
                            {console.log(tempApp2)}
                            </FormGroup>
                            </Grid>
                        </Grid>
                    </CardContent>
                    </Card> */}

                    <Card className={classes.container} variant="outlined">
                    <CardContent className={classes.cell}>
                        <Grid container>
                            <Grid item xs={3}>
                            <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={fundableFilter}
                                onChange={handleFundableFilterChange}
                                >
                                <MenuItem value={0}>No Filter</MenuItem>
                                <MenuItem value={1}>Fundable</MenuItem>
                                <MenuItem value={2}>Non-Fundable</MenuItem>
                                <MenuItem value={3}>External</MenuItem>
                                </Select>
                        </FormControl>
                            </Grid>
                            <Grid item xs={1.5}>
                            <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Experience Filter</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={experienceFilter}
                                onChange={handleExperienceFilterChange}
                                >
                                <MenuItem value={0}>No Filter</MenuItem>
                                <MenuItem value={5}>New TA</MenuItem>
                                <MenuItem value={10}>Experienced</MenuItem>
                                </Select>
                        </FormControl>
                            </Grid>
                            
                        </Grid>
                    </CardContent>
                    </Card>


                    
                        
        
                    <TableContainer className={classes.tableContainer}>
                        <Table className={classes.table} size="small">
                            <TableHead>
                                <TableRow className={classes.row}>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Fundable</TableCell>
                                    <TableCell>Experience Level</TableCell>
                                    <TableCell>Current Rank</TableCell>
                                    <TableCell>Update Rank</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courseState["applicant_list"].map((applicant,index) => {
                                    console.log(courseState)
                                    if (!applicant.profRank) {
                                        applicant.profRank = "Unranked";
                                    }
                                    console.log(experienceFilter, "filter")
                                    console.log(applicant.availability, "db")
                                    console.log( (experienceFilter == 0 ))
                                    // console.log(tempApp, "try")
                                    // Object.keys(tempApp).forEach(function(key) {
                                    //     if (tempApp[key]) {
                                    //         if(key==1){
                                    //             tempApp3 = true; 
                                    //         }
                                    //         else if(key==2){
                                    //             tempApp4 = true;
                                    //         }
                                    //         else if(key==3){
                                    //             tempApp5 = true;
                                    //         }
                                    //      else{
                                    //          tempApp3 = false;
                                    //          tempApp4 = false;
                                    //          tempApp5 = false;
                                    //      }
                                    //     }
                                    // });
                                    // Object.keys(tempApp2).forEach(function(key) {
                                    //     if (tempApp2[key]) {
                                    //         if(key==1){
                                    //             tempApp6 = true; 
                                    //         }
                                    //         else if(key==2){
                                    //             tempApp7 = true;
                                    //         }
                                    //      else{
                                    //          tempApp6 = false;
                                    //          tempApp7 = false;
                                    //      }
                                    //     }
                                    // });
                                    return (
                                        <React.Fragment>
                                            {/* {( tempApp3? (applicant.fundable == 1): tempApp4?(applicant.fundable ==2):tempApp5?(applicant.fundable==3):(applicant.fundable))
                                             && (tempApp6?(applicant.availability ==10):tempApp7?(applicant.availability==5):(applicant.availability)) && */}
                                        {(fundableFilter == 0 || applicant.fundable == fundableFilter) && (experienceFilter == 0 || applicant.availability == experienceFilter) && 
                                            <TableRow key={courseState["course"]}>
                                            <TableCell>{applicant.name}</TableCell>
                                            <TableCell>{applicant.email}</TableCell>
                                            <TableCell>{applicant.fundable == 1 ? "Fundable" : applicant.fundable == 2 ? "Non-fundable" : "External"}</TableCell>
                                            <TableCell>{applicant.availability == 5 ? "New"  : "Experienced"}</TableCell>
                                            <TableCell>{applicant.profRank}</TableCell>
                                            <TableCell>{applicant.profRank}</TableCell>
                                            <TableCell>
                                                <FormControl className={classes.formControlSelect}>
                                                    <Select defaultValue="Unranked" id="select" displayEmpty onChange={(e) => {
                                                        setRank(applicant.email,e.target.value)
                                                    }}>
                                                        <MenuItem value="Unranked">
                                                            Unranked
                                                        </MenuItem>
                                                        {courseState["applicant_list"].map((applicant,index) => {
                                                            return (
                                                                <MenuItem key={index} value={index+1}>
                                                                    {index+1}
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                                <Button className={classes.rankBtn}
                                                    color="primary"
                                                    onClick={() => {
                                                        updateRank(courseState["course_code"],applicant.email)
                                                    }}>
                                                        Submit
                                                    </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <QuestionAnswerModal questionAnswers={applicant.questionAnswerPairs} />
                                            </TableCell>
                                        </TableRow>}
                                        </React.Fragment>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </div>
                )}
            </div>
        </Dialog>
        ) : (
            <Dialog open={openCoursePopup} onClose={handlePopupClose}>
               <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        No applicants yet.
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
