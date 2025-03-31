import { useEffect, useState } from "react";
import styles from "./DoExam.module.scss";
import { getQuestionBySubSubject } from "../../Api/api";

import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showErrorToast } from "../../Utils/ToastNotification";
import { showConfirmDialog } from "../../Utils/confirmDialog";

const cx = classNames.bind(styles);

function DoExam({ selectedSubject }) {
  const [listQuestion, setListQuestion] = useState([]);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({}); // Trạng thái lỗi các câu chưa làm
  // Thời gian đếm ngược (60 phút)
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    const getQuestion = async () => {
      const data = await getQuestionBySubSubject(selectedSubject);
      setListQuestion(data.questions);
    };

    getQuestion();
  }, [selectedSubject]);
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Tự động nộp bài khi hết giờ
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });

    // Nếu đã chọn đáp án, bỏ lỗi
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[questionId];
      return updatedErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra câu nào chưa làm
    const newErrors = {};
    let firstUnansweredQuestionId = null;

    listQuestion.forEach((question) => {
      if (!answers[question.question_id]) {
        newErrors[question.question_id] = true;
        if (!firstUnansweredQuestionId) {
          firstUnansweredQuestionId = question.question_id; // Lưu ID câu chưa làm đầu tiên
        }

        // Cuộn lên câu chưa làm đầu tiên
        if (firstUnansweredQuestionId) {
          document
            .getElementById(`question-${firstUnansweredQuestionId}`)
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Cập nhật trạng thái lỗi
      showErrorToast("Bạn chưa trả lời hết tất cả câu hỏi!", 1500);
      return;
    } else {
      showConfirmDialog(
        "Bạn có chắc chắn?",
        "Sau khi nộp bài, bạn sẽ không thể thay đổi câu trả lời!",
        "warning",
        "function",
        "Đồng ý",
        "Hủy"
      );
    }
  };

  return (
    <div className={cx("container")}>
      {/* clock */}
      <div className={cx("timer")}>
        Thời gian còn lại: {formatTime(timeLeft)}
      </div>

      <form onSubmit={handleSubmit} className={cx("form")}>
        {listQuestion.map((question, index) => (
          <div key={question.question_id} className={cx("card")}>
            <h3
              id={`question-${question.question_id}`}
              className={cx("question")}
            >
              {index + 1}. {question.question_text}
              {errors[question.question_id] && (
                <div className={cx("error-icon")}>*</div>
              )}
            </h3>

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
