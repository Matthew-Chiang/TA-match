import React, { Component, useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import { AccordionDetails, AccordionSummary } from "@material-ui/core";
import { Select, MenuItem, InputLabel, NativeSelect } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAuth } from "../contexts/AuthContext";
import CourseInfoCard from "./CourseInfoCard";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
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
});

export default function CourseInfo({ email }) {
    const [isLoading, setIsLoading] = useState(true);
    const [courseData, setCourseData] = useState([]);
    const { currentUser } = useAuth();

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
    return (
        <div>
            <Grid container spacing={3}>
                {courseData["courseList"].map((course, index) => {
                    return (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <CourseInfoCard
                                course={course}
                                semester={courseData.semester}
                                viewApplicant
                            ></CourseInfoCard>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

// export default withStyles(styles)(CourseInfo)
