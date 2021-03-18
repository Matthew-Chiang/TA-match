import React, { useState } from 'react';
import {Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';

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
    container: {
        marginTop: 20,
      },
      table: {
        minWidth: 650,
      },
      dialogText: {
        fontSize: 18,
      },
      txtField: {
        marginLeft: 10,
      },
      overrideBtn: {
        marginRight: 20,
        marginBottom: 10
      },
      row: {
        fontSize: 22,
        fontWeight: "bold",
        backgroundColor: "#ECECEC"
    },
    btn: {
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
    const [isLoading, setIsLoading] = useState(true);

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
        console.log(semesterAndYear)
        axios.get(apiURL + `/semester/${semesterAndYear}`)
        .then(res => {
            res.data.forEach(course => {
                response.push(course);
            })
            if(response.length==0){
                setIsLoading(true);
            }
            else{
                setIsLoading(false)
            }
            setSemesterInfo(response);
        })
        .catch(err => {
            console.log(err);
            window.alert("That semester does not exist!");
            setSemesterInfo([]);

        });
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
            {/* <IconButton className={classes.searchIcon} color="primary" onClick={getSemesterInfo}>
                <SearchIcon />
            </IconButton> */}
            <Button className={classes.btn} onClick={getSemesterInfo} color="primary" variant="contained">
                    Search
            </Button>
            {!isLoading ? 
            <TableContainer className={classes.container}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.row}s>
                            <TableCell>Course</TableCell>
                            <TableCell>Instructor</TableCell>
                            <TableCell>TA Hours Required</TableCell>
                            <TableCell>Applicants</TableCell>
                            <TableCell>Allocated TAs</TableCell>
                            <TableCell>Hours Allocated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            semesterInfo.map(course => {
                                console.log(course)
                                return(
                                    <TableRow key={course.course}>
                                        <TableCell>{course.course}</TableCell>
                                        <TableCell>{course.details.instructor}</TableCell>
                                        <TableCell> {course.details.ta_hours}</TableCell>
                                        <TableCell>
                                        {
                                            course.applicants.map(a => {
                                                return(
                                                <div>
                                                    <li style={{listStyleType: 'none'}}key={a}>{a}</li>

                                                </div>
                                                )
                                            })
                                        }
                                        </TableCell>
                                        <TableCell>{
                                            course.allocation.map(ta => {
                                                return(
                                                <div>
                                                    <li style={{listStyleType: 'none'}}key={ta}>{ta}</li>

                                                </div>
                                                )
                                            })
                                        }</TableCell>
                                        <TableCell>{
                                            course.hours_allocated.map(h => {
                                                return(
                                                <div>
                                                    <li style={{listStyleType: 'none'}}key={h}>{h}</li>

                                                </div>
                                                )
                                            })
                                        }</TableCell>
                                        
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            : <div></div>}
        </div>
    )
}
