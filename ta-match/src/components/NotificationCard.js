import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
    cardBase: {
        padding: "10px",
    },
}));

export default function NotificationCard({ timestamp, title, text }) {
    const classes = useStyles();

    return (
        <Card className={classes.cardBase} variant="outlined">
            <h3>{title}</h3>
            <h4>{text}</h4>
            <p>{new Date(parseInt(timestamp)).toString()}</p>
        </Card>
    );
}
