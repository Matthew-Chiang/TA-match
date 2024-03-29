import Button from "@material-ui/core/Button";
import { Dialog } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";
import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { ListItemAvatar } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import PersonIcon from "@material-ui/icons/Person";
import PropTypes from "prop-types";
import ListItemText from "@material-ui/core/ListItemText";

const apiURL = "http://localhost:5000/api";

const priorities = ["Professor", "TA"];

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

function SimpleDialog({
    onClose,
    selectedValue,
    open,
    forceUpdate,
    setForceUpdate,
}) {
    const classes = useStyles();
    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
        let priorityCode;
        if (value === "Professor") {
            priorityCode = 1;
        } else {
            priorityCode = 0;
        }
        axios
            .get(apiURL + "/allocateTAs/", {
                params: {
                    preference: priorityCode,
                },
            })
            .then((res) => {
                setForceUpdate(forceUpdate + 1);
            });
    };

    return (
        <div>
            <Dialog onClose={handleClose} fullWidth={true} open={open}>
                <DialogTitle>
                    <b>Set Priority</b>
                </DialogTitle>
                <List>
                    {priorities.map((priority) => (
                        <ListItem
                            button
                            onClick={() => handleListItemClick(priority)}
                            key={priority}
                        >
                            <ListItemAvatar>
                                <PersonIcon />
                            </ListItemAvatar>
                            <ListItemText primary={priority} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </div>
    );
}

export default function SimpleDialogDemo({ forceUpdate, setForceUpdate }) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(priorities[0]);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value, sem) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <Button
                style={{ float: "right" }}
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
            >
                {" "}
                Match TA and Courses
            </Button>
            <h3>Course List</h3>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
            />
        </div>
    );
}
