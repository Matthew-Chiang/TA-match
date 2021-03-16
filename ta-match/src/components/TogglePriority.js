
import Button from '@material-ui/core/Button';
import {Dialog} from '@material-ui/core';
import {DialogTitle} from '@material-ui/core';
import {List} from '@material-ui/core';
import {ListItem} from '@material-ui/core';
import {ListItemAvatar} from '@material-ui/core';
import {Avatar} from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import axios from 'axios';
import PersonIcon from '@material-ui/icons/Person';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import { NativeSelect } from "@material-ui/core";

const apiURL = 'http://localhost:5000/api';

const priorities = ['Professor', 'TA'];
const season = ['Fall','Winter','Summer'];

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});
SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };
function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;
    const handleClose = () => {
        onClose(selectedValue);
    };
    
    const handleListItemClick = (value) => {
        onClose(value);
        let priorityCode;
        if(value === 'Professor') {
            priorityCode = 1;
        }
        else {
            priorityCode = 0;
        }
        axios.get(apiURL + '/allocateTAs/', {
            params: {
                preference: priorityCode
            }

        }).then(res => {
            console.log(res);
        });
    };

    return (
        <div>
        <Dialog onClose={handleClose} fullWidth={true} aria-labelledby="simple-dialog-title" open={open}>
             <DialogTitle id="simple-dialog-title">Match TA and Courses</DialogTitle>
             <NativeSelect
                        id="select"
                        onChange={(e) => {
                            setSelectedSem(e.target.value);
                        }}
                    >
                        <option value=""> Select semester</option>
                        {season.map((s, index) => {
                            return (
                                <option key={index}>
                                    {s}
                                </option>
                            );
                        })}
                    
                    </NativeSelect>
             <List>
                 {priorities.map((priority) => (
                    <ListItem button onClick={() => handleListItemClick(priority)} key={priority}>
                        <ListItemAvatar>
                             <Avatar className={classes.avatar}>
                                <PersonIcon />
                            </Avatar>
                         </ListItemAvatar>
                        <ListItemText primary={priority} />
                    </ListItem>
                 ))}
             </List>
        </Dialog>
        </div>
    )
}

export default function SimpleDialogDemo() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(priorities[0]);
    const [selectedSem, setSelectedSem] = React.useState(season[0]); //use this for the semester selection
    const handleClickOpen = () => {
        setOpen(true);
      };
    const handleClose = (value, sem) => {
        setOpen(false);
        setSelectedValue(value);
        setSelectedSem(sem);
      };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}> Match TA and Courses</Button>
            <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose}/>
        </div>
    )
}
