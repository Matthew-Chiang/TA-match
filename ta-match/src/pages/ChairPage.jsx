import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/ApplicantInfo";
import AllCourseInfo from "../components/AllCourseInfo";
import TogglePriority from "../components/TogglePriority";
import HoursCalculation from "../components/HoursCalculation";
import CourseSetup from "../components/CourseSetup";

import "../App.css";

import React, {useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
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
        <Box p={3} style={{paddingTop: 0}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
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
      width: 350,
    },
    tabPanel: {
        width: "100%"
    }
  }));

const ChairPage = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [instructorFlag, setInstructorFlag] = useState(true)
    const [associationFlag, setAssociationFlag] = useState(true)
    const [hoursFlag, setHoursFlag] = useState(true)
    const [exportFlag, setExportFlag] = useState(true)
    const [uplaodFlag, setUplaodFlag] = useState(true)
    const [allCourseFlag, setAllCourseFlag] = useState(true)
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <div className="container">
            <Dashboard role="chair"/>
            <br></br>
            <h1>Welcome, <span style={{fontWeight: "normal"}}>Undergraduate Chair!</span></h1>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                    
                >
                    <Tab label="1. Course Setup" />
                    <Tab label="2. Instructor Setup" disabled = {instructorFlag}/>
                    <Tab label="3. Assign Instructors" disabled = {associationFlag}/>
                    <Tab label="4. Determine TA Hours" disabled = {hoursFlag}/>
                    <Tab label="5. Export Question List" disabled = {exportFlag}/>
                    <Tab label="6. Import Applicants" disabled = {uplaodFlag}/>
                    <Tab label="7. Match TA and Courses" disabled = {allCourseFlag}/>
                </Tabs>
                <TabPanel value={value} index={0} className={classes.tabPanel}>
                    <CourseSetup 
                    setInstructorFlag = {setInstructorFlag}
                    />
                </TabPanel>
                <TabPanel value={value} index={1} className={classes.tabPanel}>
                    <InstructorSetup 
                    setAssociationFlag = {setAssociationFlag}
                    />
                </TabPanel>
                <TabPanel value={value} index={2} className={classes.tabPanel}>
                    <CourseInstructorAssociation
                    setHoursFlag = {setHoursFlag}
                    />
                </TabPanel>
                <TabPanel value={value} index={3} className={classes.tabPanel}>
                    <HoursCalculation 
                    setExportFlag = {setExportFlag}
                    />
                </TabPanel>
                <TabPanel value={value} index={4} className={classes.tabPanel}>
                    <ProfessorQuestionsExport 
                    setUplaodFlag = {setUplaodFlag}
                    />
                </TabPanel>
                <TabPanel value={value} index={5} className={classes.tabPanel}>
                    <AdminFilesUpload 
                    setAllCourseFlag ={setAllCourseFlag}
                    />
                </TabPanel>
                <TabPanel value={value} index={6} className={classes.tabPanel}>
                    <TogglePriority />
                    <AllCourseInfo editPrivilege />
                </TabPanel>
                </div>
        </div>
    );
};

export default ChairPage;
