import classNames from "classnames/bind";

import styles from "./HistoryExam.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getHistoryByExamIdAPI } from "../../Api/api";

const cs = classNames.bind(styles);

function HistoryExam({
  resultExam,
  questionsExam,
  setHeaderTitle,
  setSelectedContent,
  idHistory
}) {
  let correctCount = 0;
  let totalQuestions = 0;
  const { exam_id, answers } = resultExam;

  const [exam, setExam] = useState({});

  useEffect(() => {
    const getExam = async () => {
      if (idHistory) {        
        const rs = await getHistoryByExamIdAPI(idHistory);        
        setExam(rs);
      }
    };

    getExam();
  }, []);

  if (resultExam) {
    // Đếm số câu đúng
    correctCount = answers.reduce((count, item) => {
      const question = questionsExam.find(
        (q) => q.question_id === item.question_id
      );
      if (!question) return count;

      const correctAnswer = question.answers.find(
        (ans) => ans.is_correct === 1
      );
      if (!correctAnswer) return count;

      if (item.answer_id === correctAnswer.answer_id) {
        return count + 1;
      }

      return count;
    }, 0);
  } else if (idHistory) {
    correctCount = exam.question?.reduce((count, item) => {
      // Tìm đáp án đúng và được chọn
      const isCorrectlyAnswered = item.answers.some(
        (ans) => ans.is_correct === 1 && ans.selected_answer
      );
      return count + (isCorrectlyAnswered ? 1 : 0);
    }, 0);
  }

  if (answers) {
    totalQuestions = questionsExam.length;
  } else if (idHistory) {
    totalQuestions = exam.question?.length;
  }

  const score = ((correctCount / totalQuestions) * 10).toFixed(2); // Giữ 2 chữ số thập phân

  const handleBack = () => {
    setSelectedContent("history");
    setHeaderTitle("Lịch sử làm bài");
  };

  return (
    <div className={cs("history-container")}>
      {idHistory && (
        <FontAwesomeIcon
          className={cs("icon-back")}
          icon={faArrowLeftLong}
          onClick={handleBack}
        />
      )}

      {/* trường hợp xem kết quả vừa làm khi không đăng nhập */}
      {!idHistory ? (
        <>
          <h2 className={cs("title")}>Kết quả bài thi vừa làm</h2>

          <p className={cs("score")}>
            ✅ Số câu đúng: {correctCount}/{totalQuestions} – 🎯 Điểm: {score}
            /10
          </p>

          {answers.map((item, index) => {
            const question = questionsExam.find(
              (q) => q.question_id === item.question_id
            );

            if (!question) return null; // Nếu không tìm thấy câu hỏi, bỏ qua

            return (
              <div key={item.question_id} className={cs("question-block")}>
                <h3 className={cs("question-text")}>
                  {index + 1}. {question.question_text}
                </h3>

                <div className={cs("options")}>
                  {question.answers.map((answer) => {
                    const isSelected = answer.answer_id === item.answer_id;
                    const isCorrect = answer.is_correct === 1;

                    return (
                      <label
                        key={answer.answer_id}
                        className={cs("option", {
                          selected: isSelected,
                          correct: isCorrect,
                        })}
                      >
                        <input
                          type="radio"
                          disabled
                          checked={isSelected}
                          readOnly
                        />
                        {answer.answer_text}

                        {/* Hiển thị icon đúng/sai */}
                        {isSelected && !isCorrect && (
                          <FontAwesomeIcon
                            icon={faX}
                            className={cs("icon", "wrong")}
                          />
                        )}
                        {isCorrect && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={cs("icon", "correct")}
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {/* xem lại bài thi cụ thể khi đã đăng nhập */}
          <h2 className={cs("title")}>Kết quả {exam.exam?.title}</h2>

          <p className={cs("score")}>
            ✅ Số câu đúng: {correctCount}/{totalQuestions} – 🎯 Điểm: {score}
            /10
          </p>

          {exam.question?.map((item, index) => {
            return (
              <div key={item.question_id} className={cs("question-block")}>
                <h3 className={cs("question-text")}>
                  {index + 1}. {item.question_text}
                </h3>

                <div className={cs("options")}>
                  {item.answers.map((answer) => {
                    return (
                      <label
                        key={answer.answer_id}
                        className={cs("option", {
                          selected: answer.selected_answer,
                          correct: answer.is_correct,
                        })}
                      >
                        <input
                          type="radio"
                          disabled
                          checked={answer.selected_answer}
                          readOnly
                        />

                        {answer.answer_text}

                        {answer.selected_answer &&
                          !Boolean(answer.is_correct) && (
                            <FontAwesomeIcon
                              icon={faX}
                              className={cs("icon", "wrong")}
                            />
                          )}
                        {Boolean(answer.is_correct) && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={cs("icon", "correct")}
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default HistoryExam;
