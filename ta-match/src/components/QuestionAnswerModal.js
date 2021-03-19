import Dashboard from "../components/Dashboard";
import "../App.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CourseInfo from "../components/CourseInfo";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

const QuestionAnswerModal = ({ questionAnswers }) => {
    const [openQuestionAnswerModal, setOpenQuestionAnswerModal] = useState(
        false
    );

    const useStyles = makeStyles((theme) => ({
        btn: {
            float: "right",
            marginTop: 20,
        },
        dialogTitle: {
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
        },
        dialogContainer: {
            paddingLeft: "70px",
            paddingBottom: "100px",
        },
        questionPair: {
            paddingBottom: "30px",
        },
    }));

    const classes = useStyles();

    return (
        <div>
            <Button
                color="primary"
                onClick={() => {
                    setOpenQuestionAnswerModal(true);
                    console.log(questionAnswers);
                }}
            >
                See Full Application
            </Button>

            <Dialog
                open={openQuestionAnswerModal}
                onClose={() => {
                    setOpenQuestionAnswerModal(false);
                }}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenQuestionAnswerModal(false);
                        }}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
                <div style={{ backgroundColor: "white" }}>
                    <DialogTitle>
                        <h1 className={classes.dialogTitle}>
                            View TA Application
                        </h1>
                    </DialogTitle>
                    <DialogContent className={classes.dialogContainer}>
                        {questionAnswers.map((QaPairs, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classes.questionPair}
                                >
                                    <Typography variant="h6">
                                        Question {index + 1}: {QaPairs.question}
                                    </Typography>
                                    <Typography>{QaPairs.answer}</Typography>
                                </div>
                            );
                        })}
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
};

export default QuestionAnswerModal;
