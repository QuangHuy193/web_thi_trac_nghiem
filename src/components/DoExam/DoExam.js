import { useEffect, useState } from "react";
import classNames from "classnames/bind";

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
  questionsExam,
  user,
  setResultExam,
  setIdExam
}) {
  // Lưu đáp án người dùng chọn
  const [answers, setAnswers] = useState([]);
  // Lưu lỗi nếu người dùng chưa trả lời câu hỏi nào đó
  const [errors, setErrors] = useState({});
  // Đếm ngược thời gian làm bài (đơn vị: phút)
  const [timeLeft, setTimeLeft] = useState(timeExam * 60);
  // Dữ liệu gửi lên khi nộp bài
  const [formData, setFormData] = useState({
    exam_id: idExam,
    results: [],
  });

  // useEffect để cập nhật thời gian đếm ngược mỗi giây
  useEffect(() => {
    if (timeLeft <= 0) {
      handleClickSubmit(); // Tự động nộp bài khi hết giờ
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Xóa interval khi component unmount
  }, [timeLeft]);

  // Cập nhật formData khi người dùng chọn câu trả lời
  useEffect(() => {
    setFormData({
      exam_id: idExam,
      results: answers,
    });
  }, [answers]);

  // Định dạng lại thời gian sang phút:giây
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Xử lý chọn đáp án cho từng câu hỏi
  const handleSelectAnswer = (questionId, answerId) => {
    const newAnswer = {
      question_id: questionId,
      answer_id: answerId,
    };

    // Cập nhật hoặc thêm mới
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.question_id === questionId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });

    // Nếu đã chọn thì xóa lỗi (nếu có)
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[questionId];
      return updatedErrors;
    });
  };

  const handleSubmitHasLogin = () => {
    // TODO: gọi API để nộp bài tại đây
    setSelectedContent("history");
    setIdExam("")
    setHeaderTitle("Lịch sử làm bài");
    showSuccessToast("Nộp bài thành công!", 1200);
  };

  const handleSubmitNoLogin = () => {
    setResultExam(formData);
    setIdExam("")
    setHeaderTitle("Kết quả làm bài");
    setSelectedContent("historyExam");
    showSuccessToast("Nộp bài thành công!", 1200);
  };

  // Xử lý khi người dùng bấm nút "Nộp bài" hoặc khi hết giờ
  const handleClickSubmit = (e) => {
    if (e) e.preventDefault();

    // Trường hợp người dùng bấm nút nộp bài
    if (e) {
      const newErrors = {};
      let firstUnansweredQuestionId = null;

      // Kiểm tra các câu chưa trả lời
      questionsExam.forEach((question) => {
        const answered = answers.find(
          (a) => a.question_id === question.question_id
        );

        if (!answered) {
          newErrors[question.question_id] = true;

          if (!firstUnansweredQuestionId) {
            firstUnansweredQuestionId = question.question_id;
          }
        }
      });

      // Cuộn đến câu hỏi chưa trả lời đầu tiên (nếu có)
      if (firstUnansweredQuestionId) {
        document
          .getElementById(`question-${firstUnansweredQuestionId}`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }

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
            if (user) {
              handleSubmitHasLogin();
            } else {
              handleSubmitNoLogin();
            }
          },
          "Đồng ý",
          "Hủy"
        );
      }
    } else {
      // Trường hợp hết giờ tự động nộp bài
      if (user) {
        handleSubmitHasLogin();
      } else {
        handleSubmitNoLogin();
      }
    }
  };

  return (
    <div className={cx("container")}>
      {/* Hiển thị thời gian còn lại */}
      <div className={cx("timer")}>
        Thời gian còn lại: {formatTime(timeLeft)}
      </div>

      {/* Form câu hỏi trắc nghiệm */}
      <form onSubmit={handleClickSubmit} className={cx("form")}>
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
                          answers.find(
                            (a) => a.question_id === question.question_id
                          )?.answer_id === answer.answer_id
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
