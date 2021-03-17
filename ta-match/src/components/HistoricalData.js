import React, { useState } from 'react';
import {IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonIcon from '@material-ui/icons/Person';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const apiURL = 'http://localhost:5000/api';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    searchIcon: {
        margin: theme.spacing(2.5),
    },

  }));

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: 16,
    },
  }))(TableCell);

export default function HistoricalData() {
    const classes = useStyles();
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');
    const [semesterInfo, setSemesterInfo] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [open, setOpen] = useState(false);

    const handleSemester = (event) => {
        const updatedSemester = event.target.value;
        setSemester(updatedSemester);
    }

    const handleYear = (event) => {
        const updatedYear = event.target.value;
        setYear(updatedYear);
    }

    const getSemesterInfo = () => {
        let response = [];
        let semesterAndYear = semester + year;
        axios.get(apiURL + `/semester/${semesterAndYear}`)
        .then(res => {
            res.data.forEach(course => {
                response.push(course);
            })
            setSemesterInfo(response);
        })
        .catch(err => {
            console.log(err);
            window.alert("That semester does not exist!");
            setSemesterInfo([]);
            setApplicants([]);
            setAllocations([]);
        });
    }

    const getApplicants = (course) => {
        let response = [];
        let semesterAndYear = semester + year;
        axios.get(apiURL + `/applicants/${semesterAndYear}/${course}`)
        .then(res => {
            res.data.forEach(applicant => {
                response.push(applicant);
            })
            console.log(res.data);
            setApplicants(response);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setApplicants([]);
        setOpen(false);
    }
    return(
        <div>
            <h1>View Past Semesters</h1>
            <FormControl className={classes.formControl}>
                <InputLabel>Semester</InputLabel>
                <Select value={semester} onChange={handleSemester}>
                    <MenuItem value="summer">Summer</MenuItem>
                    <MenuItem value="fall">Fall</MenuItem>
                    <MenuItem value="winter">Winter</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Year</InputLabel>
                <Select value={year} onChange={handleYear}>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2019">2019</MenuItem>
                    <MenuItem value="2018">2018</MenuItem>
                    <MenuItem value="2017">2017</MenuItem>
                </Select>
            </FormControl>
            <IconButton className={classes.searchIcon} color="primary" onClick={getSemesterInfo}>
                <SearchIcon />
            </IconButton>
            <br /><br /><br />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {semesterInfo.length > 0 && <StyledTableCell>COURSE</StyledTableCell>}
                            {semesterInfo.length > 0 && <StyledTableCell>INSTRUCTOR</StyledTableCell>}
                            {semesterInfo.length > 0 && <StyledTableCell>TA HOURS</StyledTableCell>}
                            {semesterInfo.length > 0 && <StyledTableCell>TAs</StyledTableCell>}
                            {semesterInfo.length > 0 && <StyledTableCell>APPLICANTS</StyledTableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            semesterInfo.map(course => {
                                return(
                                    <TableRow key={course.course}>
                                        <TableCell>{course.course}</TableCell>
                                        <TableCell>{course.details.instructor}</TableCell>
                                        <TableCell> {course.details.ta_hours}</TableCell>
                                        <TableCell>{
                                            course.allocation.map(ta => {
                                                return(
                                                    <li style={{listStyleType: 'none'}}key={ta}>{ta}</li>
                                                )
                                            })
                                        }</TableCell>
                                        <TableCell><IconButton onClick={() => { getApplicants(course.course); handleOpen() }}><AccountCircleIcon /></IconButton></TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <ApplicantsDialog open={open} close={handleClose} applicants={applicants}/>
        </div>
    )
}
function ApplicantsDialog(props) {
    const classes = useStyles();
    const {open, close, applicants} = props;
    const handleClose = () => {
        close();
    }
    return (
            <Dialog open={open} onClose={handleClose}> 
                <DialogTitle>Applicants</DialogTitle>
                <List>
                {
                    applicants.map((applicant) => (
                        <ListItem key={applicant.applicant}>
                            <PersonIcon color="primary"/><Box m={1} />
                            <ListItemText primary={applicant.applicant} />
                        </ListItem>
                    ))
                }
                </List>
            </Dialog>
    )
}