import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/AdminFilesUpload";
import AllCourseInfo from "../components/AllCourseInfo";
import TogglePriority from "../components/TogglePriority";
import HoursCalculation from "../components/HoursCalculation";
import HistoricalData from "../components/HistoricalData";

import "../App.css";

import React, {useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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
      width: 300,
    },
    tabPanel: {
        width: "100%"
    }
  }));

const ChairPage = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <div className="container">
            <Dashboard role="chair"/>
            <br></br>
            <h1>Welcome, <span style={{fontWeight: "normal"}}>Undergraduate Chair!</span></h1>
            <h6>Current Semester: Summer 2021</h6>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                >
                    <Tab label="1. Calculate TA Hours" />
                    <Tab label="2. Upload Applicant Data" />
                    <Tab label="3. Match TA and Courses"/>
                </Tabs>
                <TabPanel value={value} index={0} className={classes.tabPanel}>
                    <HoursCalculation />
                </TabPanel>
                <TabPanel value={value} index={1} className={classes.tabPanel}>
                    <AdminFilesUpload />
                </TabPanel>
                <TabPanel value={value} index={2} className={classes.tabPanel}>
                    <TogglePriority />
                    <AllCourseInfo editPrivilege />
                </TabPanel>
                </div>
             {/* <AdminFilesUpload />
             <br></br>
            <AllCourseInfo editPrivilege />
             <br />
             <br />
             <TogglePriority />
             <HoursCalculation />
            <br />
            <br />
            <HistoricalData />  */}
        </div>
    );
};

export default ChairPage;
