import React, { useState } from 'react';
import { Button, TextField, IconButton } from '@material-ui/core';
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

const apiURL = 'http://localhost:5000/api';

const useStyles = makeStyles({

});

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: 16,
    },
  }))(TableCell);

export default function HistoricalData() {
    const [semester, setSemester] = useState('');
    const [course, setCourse] = useState('');
    const [semesterInfo, setSemesterInfo] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [open, setOpen] = useState(false);

    const handleInputChange = (event) => {
        const updatedSemester = event.target.value;
        setSemester(updatedSemester);
    }

    const getSemesterInfo = () => {
        let response = [];
        axios.get(apiURL + `/semester/${semester}`)
        .then(res => {
            res.data.forEach(course => {
                response.push(course);
            })
            //console.log(res.data);
            setSemesterInfo(response);
        })
        .catch(err => {
            console.log(err);
            window.alert("That semester does not exist!");
        });
    }

    const getApplicants = (course) => {
        let response = [];
        axios.get(apiURL + `/applicants/${semester}/${course}`)
        .then(res => {
            res.data.forEach(applicant => {
                response.push(applicant);
            })
            //console.log(res.data);
            setApplicants(response);
        })
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return(
        <div>
            <h1>View Past Semesters</h1>
            <TextField id="outlined-basic" label="Semester" variant="outlined" value={semester} onChange={handleInputChange}/>
            <IconButton color="primary" onClick={getSemesterInfo}>
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
                                        <TableCell>{course.details.ta_hours}</TableCell>
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