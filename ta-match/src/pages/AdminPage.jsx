import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/ApplicantInfo";
import AllCourseInfo from "../components/AllCourseInfo";
import TogglePriority from "../components/TogglePriority";
import HoursCalculation from "../components/HoursCalculation";
import CourseSetup from "../components/CourseSetup";

import "../App.css";

import React, { useState, useEffect } from "react";
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Toolbar,
    IconButton,
    Slide,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ProfessorQuestionsExport from "../components/ProfessorQuestionsExport";
import InstructorSetup from "../components/InstructorSetup";
import CourseInstructorAssociation from "../components/CourseInstructorAssociation";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} style={{ paddingTop: 0 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: "flex",
        height: "100%",
        textAlign: "left",
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        width: 300,
    },
    tabPanel: {
        width: "100%",
    },
}));

const AdminPage = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [instructorFlag, setInstructorFlag] = useState();
    const [associationFlag, setAssociationFlag] = useState();
    const [hoursFlag, setHoursFlag] = useState();
    const [exportFlag, setExportFlag] = useState();
    const [uplaodFlag, setUplaodFlag] = useState();
    const [allCourseFlag, setAllCourseFlag] = useState();
    const [open, setOpen] = useState(false);
    const [forceUpdateMathes, setForceUpdateMatches] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //make tabs persistent across session
    useEffect(() => {
        setInstructorFlag(
            localStorage.getItem("localInstructorFlag") == "true"
        );
        setAssociationFlag(
            localStorage.getItem("localAssociationFlag") == "true"
        );
        setHoursFlag(localStorage.getItem("localHoursFlag") == "true");
        setExportFlag(localStorage.getItem("localExportFlag") == "true");
        setUplaodFlag(localStorage.getItem("localUplaodFlag") == "true");
        setAllCourseFlag(localStorage.getItem("localAllCourseFlag") == "true");
    }, []);

    useEffect(() => {
        console.log(
            associationFlag,
            localStorage.getItem("localAssociationFlag")
        );
        localStorage.setItem("localInstructorFlag", instructorFlag);
        localStorage.setItem("localAssociationFlag", associationFlag);
        localStorage.setItem("localHoursFlag", hoursFlag);
        localStorage.setItem("localExportFlag", exportFlag);
        localStorage.setItem("localUplaodFlag", uplaodFlag);
        localStorage.setItem("localAllCourseFlag", allCourseFlag);
    }, [
        instructorFlag,
        associationFlag,
        hoursFlag,
        exportFlag,
        uplaodFlag,
        allCourseFlag,
    ]);

    function deleteAllData() {
        //fix
        fetch(`http://localhost:5000/api/blowUpDB`)
            .then((response) => {
                alert("All semester data has been deleted");
                console.log(response);
                handleClose();
                localStorage.clear();
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="container">
            <Dashboard role="chair" />
            <br></br>
            <h1>
                Welcome,{" "}
                <span style={{ fontWeight: "normal" }}>
                    Undergraduate Chair / Admin!
                </span>
            </h1>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                >
                    <Tab label="1. Course Setup" />
                    <Tab
                        label="2. Instructor Setup"
                        disabled={!instructorFlag}
                    />
                    <Tab
                        label="3. Assign Instructors"
                        disabled={!associationFlag}
                    />
                    <Tab label="4. Determine TA Hours" disabled={!hoursFlag} />
                    <Tab
                        label="5. Export Question List"
                        disabled={!exportFlag}
                    />
                    <Tab label="6. Import Applicants" disabled={!uplaodFlag} />
                    <Tab
                        label="7. Match TA and Courses"
                        disabled={!allCourseFlag}
                    />
                    <Button
                        color="secondary"
                        disabled={!instructorFlag}
                        onClick={handleOpen}
                    >
                        Delete all semester data
                    </Button>
                </Tabs>
                <TabPanel value={value} index={0} className={classes.tabPanel}>
                    <CourseSetup setInstructorFlag={setInstructorFlag} />
                </TabPanel>
                <TabPanel value={value} index={1} className={classes.tabPanel}>
                    <InstructorSetup setAssociationFlag={setAssociationFlag} />
                </TabPanel>
                <TabPanel value={value} index={2} className={classes.tabPanel}>
                    <CourseInstructorAssociation setHoursFlag={setHoursFlag} />
                </TabPanel>
                <TabPanel value={value} index={3} className={classes.tabPanel}>
                    <HoursCalculation setExportFlag={setExportFlag} />
                </TabPanel>
                <TabPanel value={value} index={4} className={classes.tabPanel}>
                    <ProfessorQuestionsExport setUplaodFlag={setUplaodFlag} />
                </TabPanel>
                <TabPanel value={value} index={5} className={classes.tabPanel}>
                    <AdminFilesUpload setAllCourseFlag={setAllCourseFlag} />
                </TabPanel>
                <TabPanel value={value} index={6} className={classes.tabPanel}>
                    <TogglePriority
                        forceUpdate={forceUpdateMathes}
                        setForceUpdate={setForceUpdateMatches}
                    />
                    <AllCourseInfo
                        editPrivilege
                        forceUpdate={forceUpdateMathes}
                    />
                </TabPanel>
            </div>
            <Dialog open={open} fullWidth={true} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        <Typography>
                            <Box fontStyle="bold">
                                Are you sure you want to delete all the current
                                semester data?
                            </Box>
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                    >
                        No, do not delete all data
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={deleteAllData}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminPage;
