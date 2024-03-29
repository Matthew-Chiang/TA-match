import React, { Component, useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useAuth } from "../contexts/AuthContext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";

import { Alert } from "@material-ui/lab";
import CourseInfoCardNew from "./CourseInfoCardNew";

const useStyles = makeStyles({
    root: {
        //minWidth: 275
        width: 800,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginTop: 6,
    },
    container: {
        marginTop: 20,
    },
    table: {
        minWidth: 1000,
    },
    dialogText: {
        fontSize: 18,
    },
    txtField: {
        marginLeft: 10,
    },
    overrideBtn: {
        marginRight: 20,
        marginBottom: 10,
    },
});

export default function CourseInfo({ email }) {
    const [isLoading, setIsLoading] = useState(true);
    const [courseData, setCourseData] = useState([]);
    const { currentUser } = useAuth();

    const [error, setError] = useState("");
    let ranking = 0;

    useEffect(() => {
        fetch(`http://localhost:5000/api/getApplicantData/${email}`)
            .then((response) => {
                response
                    .json()
                    .then((data) => {
                        setCourseData(data);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const classes = useStyles();
    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    if (courseData["courseList"]) {
        return (
            <div>
                {error && <Alert severity="error">{error}</Alert>}
                <Grid container spacing={0.75}>
                    {courseData["courseList"].map((course, index) => {
                        return (
                            <Grid key={index} item xs={12}>
                                <CourseInfoCardNew
                                    course={course}
                                    semester={courseData.semester}
                                    setError={setError}
                                    viewApplicant
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        );
    } else {
        return (
            <Typography className={classes.title} color="textSecondary">
                No Classes
            </Typography>
        );
    }
}

// export default withStyles(styles)(CourseInfo)
