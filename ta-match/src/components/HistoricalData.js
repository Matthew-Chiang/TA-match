import React, { useState } from 'react';
import { Button, TextField, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

const apiURL = 'http://localhost:5000/api';

export default function HistoricalData() {
    const [semester, setSemester] = useState('');

    const handleInputChange = (event) => {
        const updatedSemester = event.target.value;
        setSemester(updatedSemester);
    }

    const getSemesterInfo = () => {
        axios.get(apiURL + `/semester/${semester}`)
        .then(res => {
            console.log(res);
        });
    }

    return(
        <div>
            <h1>View Past Semesters</h1>
            <TextField id="outlined-basic" label="Semester" variant="outlined" value={semester} onChange={handleInputChange}/>
            <IconButton color="primary" onClick={getSemesterInfo}>
                <SearchIcon />
            </IconButton>
        </div>
    )
}