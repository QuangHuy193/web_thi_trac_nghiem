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
  // Lưu đáp án người dùng chọn
  const [answers, setAnswers] = useState({});
  // Lưu lỗi nếu người dùng chưa trả lời câu hỏi nào đó
  const [errors, setErrors] = useState({}); 
  // Đếm ngược thời gian làm bài (đơn vị: phút)
  const [timeLeft, setTimeLeft] = useState(timeExam * 60);
  // Dữ liệu gửi lên khi nộp bài
  const [formData, setFormData] = useState({
    exam_id: idExam,
    reselts: {},
  });

  // useEffect để cập nhật thời gian đếm ngược mỗi giây
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Tự động nộp bài khi hết giờ
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Xóa interval khi component unmount
  }, [timeLeft]);

  // Định dạng lại thời gian sang phút:giây
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Xử lý chọn đáp án cho từng câu hỏi
  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });

    // Nếu đã chọn thì xóa lỗi (nếu có)
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[questionId];
      return updatedErrors;
    });
  };

  // Xử lý khi người dùng bấm nút "Nộp bài" hoặc khi hết giờ
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Trường hợp người dùng bấm nút nộp bài
    if (e) {
      const newErrors = {};
      let firstUnansweredQuestionId = null;

      // Kiểm tra các câu chưa trả lời
      questionsExam.forEach((question) => {
        if (!answers[question.question_id]) {
          newErrors[question.question_id] = true;
          if (!firstUnansweredQuestionId) {
            firstUnansweredQuestionId = question.question_id;
          }

          // Cuộn đến câu hỏi chưa trả lời đầu tiên
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
        setErrors(newErrors); // Hiển thị lỗi
        showErrorToast("Bạn chưa trả lời hết tất cả câu hỏi!", 1500);
        return;
      } else {
        // Hiện hộp thoại xác nhận trước khi nộp
        showConfirmDialog(
          "Bạn có chắc chắn?",
          "Sau khi nộp bài, bạn sẽ không thể thay đổi câu trả lời!",
          "info",
          () => {
            setSelectedContent("history");
            setHeaderTitle("Lịch sử làm bài");

            // TODO: gọi API để nộp bài tại đây
            // setFormData({ ...formData, reselts: answers });
            // console.log(JSON.stringify(formData, null, 2));

            showSuccessToast("Nộp bài thành công!", 1200);
          },
          "Đồng ý",
          "Hủy"
        );
      }
    } else {
      // Trường hợp hết giờ tự động nộp bài
      // TODO: gọi API tại đây nếu cần
    }
  };

  return (
    <div className={cx("container")}>
      {/* Hiển thị thời gian còn lại */}
      <div className={cx("timer")}>
        Thời gian còn lại: {formatTime(timeLeft)}
      </div>

      {/* Form câu hỏi trắc nghiệm */}
      <form onSubmit={handleSubmit} className={cx("form")}>
        {Array.isArray(questionsExam) &&
          questionsExam.map((question, index) => (
            <div key={question.question_id} className={cx("card")}>
              {/* Câu hỏi */}
              <h3
                id={`question-${question.question_id}`}
                className={cx("question")}
              >
                {index + 1}. {question.question_text}
                {errors[question.question_id] && (
                  <div className={cx("error-icon")}>*</div> // Hiển thị dấu lỗi
                )}
              </h3>

              {/* Danh sách đáp án */}
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

        {/* Nút nộp bài */}
        <button type="submit" className={cx("submit-button")}>
          Nộp bài
        </button>
      </form>
    </div>
  );
}


export default DoExam;
