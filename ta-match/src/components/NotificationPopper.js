import React, { useState } from "react";
import Popper from "@material-ui/core/Popper";
import { AuthContext } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backgroundPopper: {
        border: "1px solid",
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function NotificationPopper({ open, target }) {
    const userContext = React.useContext(AuthContext);
    const classes = useStyles();
    const [notifications, setNotifications] = useState({});

    const getNotifications = () => {
        fetch(
            `http://localhost:5000/api/getNotifications/${
                userContext.currentUser ? userContext.currentUser.email : ""
            }`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => {
                console.log(res);
                res.json()
                    .then((data) => {
                        setNotifications(data);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <Popper open={open} anchorEl={target}>
            <div className={classes.backgroundPopper}>
                <div>Questions Here</div>
                <div>
                    <Button>Clear</Button>
                </div>
            </div>
        </Popper>
    );
}
