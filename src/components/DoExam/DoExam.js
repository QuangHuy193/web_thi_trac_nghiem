import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import { getQuestionBySubSubjectIdAPI } from "../../Api/api";
import styles from "./DoExam.module.scss";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";

const cx = classNames.bind(styles);

function DoExam({ 
  setSelectedContent,
  setHeaderTitle,
  idExam,
  timeExam,
  questionsExam
}) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({}); // Trạng thái lỗi các câu chưa làm
  // Thời gian đếm ngược (60 phút)
  const [timeLeft, setTimeLeft] = useState(timeExam * 60);
  //form
  const [formData, setFormData] = useState({
    exam_id: idExam,
    reselts: {},
  });

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
    if (e) e.preventDefault();

    // khi người dùng tự bấm nộp bài
    if (e) {
      // Kiểm tra câu nào chưa làm
      const newErrors = {};
      let firstUnansweredQuestionId = null;

      questionsExam.forEach((question) => {
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
          "info",
          () => {
            setSelectedContent("history");
            setHeaderTitle("Lịch sử làm bài");
            // ! xử lý API
            // setFormData({ ...formData, reselts: answers });
            // console.log(JSON.stringify(formData, null, 2));
            showSuccessToast("Nộp bài thành công!", 1200);
          },
          "Đồng ý",
          "Hủy"
        );
      }
    } else {
      // khi hết giờ tự nộp bài
      // ! xử lý API
    }
  };

  return (
    <div className={cx("container")}>
      {/* clock */}
      <div className={cx("timer")}>
        Thời gian còn lại: {formatTime(timeLeft)}
      </div>

      <form onSubmit={handleSubmit} className={cx("form")}>
        {Array.isArray(questionsExam) &&
          questionsExam.map((question, index) => (
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
                {Array.isArray(question.answers) &&
                  question.answers.map((answer) => (
                    <label key={answer.answer_id} className={cx("answer")}>
                      <input
                        type="radio"
                        name={`question-${question.question_id}`}
                        value={answer.answer_id}
                        checked={
                          answers[question.question_id] === answer.answer_id
                        }
                        onChange={() =>
                          handleSelectAnswer(
                            question.question_id,
                            answer.answer_id
                          )
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
