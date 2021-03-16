import Dashboard from "../components/Dashboard";
import "../App.css";
import Modal from "@material-ui/core/Modal";
import React, { useState } from "react";
import CourseInfo from "../components/CourseInfo";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

const QuestionAnswerModal = ({ questionAnswers }) => {
    const [openQuestionAnswerModal, setOpenQuestionAnswerModal] = useState(
        false
    );
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

            <Modal
                open={openQuestionAnswerModal}
                onClose={() => {
                    setOpenQuestionAnswerModal(false);
                }}
            >
                <div style={{ backgroundColor: "white" }}>
                    {questionAnswers.map((QaPairs, index) => {
                        return (
                            <div key={index}>
                                <Typography variant="h6">
                                    Question {index + 1}: {QaPairs.question}
                                </Typography>
                                <Typography>{QaPairs.answer}</Typography>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
};

export default QuestionAnswerModal;
