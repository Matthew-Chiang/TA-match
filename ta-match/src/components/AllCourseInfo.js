import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAuth } from "../contexts/AuthContext";
import CourseInfoCard from "./CourseInfoCard";
import { Alert } from "@material-ui/lab";
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

export default function AllCourseInfo({ email, editPrivilege }) {
    const [isLoading, setIsLoading] = useState(true);
    const [courseData, setCourseData] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => {
        fetch(`http://localhost:5000/api/getAllApplicantData`)
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

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }
    return (
        <div>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
                {console.log(courseData)}

                {Object.keys(courseData["profs"]).map((prof, index) => {
                    return (
                        courseData.profs[prof].courseList.map(
                            (course, index) => {
                                return (
                                    <Grid
                                        key={index}
                                        item
                                        xs={12}
                                    >
                                        <CourseInfoCardNew
                                            course={course}
                                            semester={courseData.semester}
                                            setError={setError}
                                            editPrivilege
                                        ></CourseInfoCardNew>
                                    </Grid>
                                );
                            }
                        )
                    );
                })}
            </Grid>
        </div>
    );
}

// export default withStyles(styles)(CourseInfo)
