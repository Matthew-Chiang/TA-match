import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import CourseInfoCardNew from "./CourseInfoCardNew";

export default function AllCourseInfo({ email, editPrivilege }) {
    const [isLoading, setIsLoading] = useState(true);
    const [courseData, setCourseData] = useState([]);

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
            <Grid container spacing={1}>
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
