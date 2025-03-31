import { useEffect, useState } from "react";
import styles from "./DoExam.module.scss";
import { getQuestionBySubSubject } from "../../Api/api";

import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function DoExam({ selectedSubject }) {
  const [listQuestion, setListQuestion] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const getQuestion = async () => {
      const data = await getQuestionBySubSubject(selectedSubject);
      setListQuestion(data.questions);
    };

    getQuestion();
  }, [selectedSubject]);

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User answers:", answers);
  };

  return (
    <div className={cx("container")}>   
      <form onSubmit={handleSubmit} className={cx("form")}>
        {listQuestion.map((question) => (
          <div key={question.question_id} className={cx("card")}>
            <h3 className={cx("question")}>{question.question_text}</h3>
            <div className={cx("options")}>
              {question.answers.map((answer) => (
                <label key={answer.answer_id} className={cx("answer")}>
                  <input
                    type="radio"
                    name={`question-${question.question_id}`}
                    value={answer.answer_id}
                    checked={answers[question.question_id] === answer.answer_id}
                    onChange={() =>
                      handleSelectAnswer(question.question_id, answer.answer_id)
                    }
                  />
                  {answer.answer_text}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className={cx("submit-button")}>
          Nộp bài
        </button>
      </form>
    </div>
  );
}

export default DoExam;
