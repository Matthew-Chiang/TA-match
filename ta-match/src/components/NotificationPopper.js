import React, { useState, useEffect } from "react";
import Popper from "@material-ui/core/Popper";
import { AuthContext } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ClickAwayListener } from "@material-ui/core";
import NotificationCard from "./NotificationCard";

const useStyles = makeStyles((theme) => ({
    backgroundPopper: {
        border: "1px solid",
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function NotificationPopper({ open, setOpen, target }) {
    const userContext = React.useContext(AuthContext);
    const classes = useStyles();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (open) {
            fetch(
                `http://localhost:5000/api/notifications/${
                    userContext.currentUser ? userContext.currentUser.email : ""
                }`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            )
                .then((res) => {
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
        }
    }, [open]);

    return (
        <ClickAwayListener
            onClickAway={() => {
                setOpen(false);
            }}
        >
            <Popper open={open} anchorEl={target}>
                <div className={classes.backgroundPopper}>
                    {[...notifications].reverse().map((notif) => (
                        <NotificationCard
                            key={notif.timestamp}
                            timestamp={notif.timestamp}
                            title={notif.title}
                            text={notif.text}
                        />
                    ))}
                    {notifications.length === 0 && (
                        <h3>
                            No current notifications! Check back later for any
                            updates.
                        </h3>
                    )}
                </div>
            </Popper>
        </ClickAwayListener>
    );
}
