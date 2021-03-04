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

export default function CourseInfoCard({ course, semester }) {
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                >
                    University of Western Ontario
                </Typography>
                <p> {course["course_code"]} </p>
                <Typography className={classes.pos} color="textSecondary">
                    {semester}
                </Typography>
                {/*TODO this accordion should prob be put in its own component - there are 2 of them for applicants and allocations*/}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div>Applicants:</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {course["applicant_list"].map(
                                (applicant, index) => {
                                    return (
                                        <div key={index}>
                                            {/* need to be dynamic */}
                                            <p>Name: {applicant.name}</p>
                                            <p>Email: {applicant.email}</p>
                                            <p>
                                                Fundable: {applicant.fundable}
                                            </p>
                                            <p>Answer 1: {applicant.answer1}</p>
                                            <p>Answer 2: {applicant.answer2}</p>
                                            <InputLabel id="label">
                                                Rank
                                            </InputLabel>
                                            <NativeSelect id="select">
                                                {course["applicant_list"].map(
                                                    (applicant, index) => {
                                                        return (
                                                            <option key={index}>
                                                                {index + 1}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </NativeSelect>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div>TA Allocations:</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {course["allocation_list"]
                                .filter((TA) => TA.status === "confirmed")
                                .map((allocation, index) => {
                                    return (
                                        <div key={index}>
                                            {allocation.email}
                                        </div>
                                    );
                                })}
                        </div>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    );
}

// export default withStyles(styles)(CourseInfo)
