import classNames from "classnames/bind";

import styles from "./MakeQuestion.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { makeQuestionAPI } from "../../Api/api";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";

const cx = classNames.bind(styles);

function MakeQuestion({
  setIsMakeQuestion,
  user,
  selectedSubSubject,
  setRefreshQuestion,
}) {
  const [formData, setFormdata] = useState({
    subject_id: selectedSubSubject,
    question_text: "",
    difficulty: "",
    created_by: user.user_id,
    answers: [{}, {}, {}, {}],
  });

  const handleQuestionChange = (e) => {
    setFormdata({ ...formData, question_text: e.target.value });
  };

  const handleDifficultyicultyChange = (e) => {
    setFormdata({ ...formData, difficulty: e.target.value });
  };

  const handleAnswerChange = (e, index) => {
    const { value } = e.target;

    // Sao chép mảng answers để tránh thay đổi trực tiếp state
    const newAnswers = [...formData.answers];

    // Cập nhật giá trị tại index tương ứng
    newAnswers[index] = {
      ...newAnswers[index],
      answer_text: value,
    };

    // Cập nhật state
    setFormdata((prevData) => ({
      ...prevData,
      answers: newAnswers,
    }));
  };

  const handleIsCorrectSelected = (index) => {
    // Tạo mảng mới, cập nhật chỉ phần tử tại index là true
    const newAnswers = formData.answers.map((answer, i) => ({
      ...answer,
      is_correct: i === index, // Đúng tại index được chọn, các phần khác false
    }));

    // Cập nhật state
    setFormdata((prevData) => ({
      ...prevData,
      answers: newAnswers,
    }));
  };

  const handleCloseForm = () => {
    setIsMakeQuestion(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(
      //   formData.subject_id,
      //   formData.question_text,
      //   formData.difficulty,
      //   formData.created_by,
      //   formData.answers
      // );
      const result = await makeQuestionAPI(
        formData.subject_id,
        formData.question_text,
        formData.difficulty,
        formData.created_by,
        formData.answers
      );

      if (result.question) {
        showSuccessToast("Tạo câu hỏi thành công!", 1200);
        setIsMakeQuestion(false);
        setRefreshQuestion((prev) => !prev);
      } else {
        showErrorToast(result.message, 1200);
      }
    } catch (error) {
      showErrorToast("Có lỗi xảy ra, vui lòng thử lại...", 1200);
    }
  };
  return (
    <div className={cx("container")}>
      <form className={cx("form")}>
        <div className={cx("icon-close")}>
          <FontAwesomeIcon icon={faClose} onClick={handleCloseForm} />
        </div>
        <div className={cx("title-group")}>
          <label className={cx("title")}>Thêm câu hỏi</label>
        </div>
        <div className={cx("question-group")}>
          <label>Nhập nội dung câu hỏi:</label>
          <textarea
            className={cx("question")}
            onChange={handleQuestionChange}
          />
        </div>
        <div className={cx("difficulty-group")}>
          <label>Độ khó của câu hỏi:</label>
          <select onChange={handleDifficultyicultyChange}>
            <option value="">--chọn độ khó--</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
        <div className={cx("answer-group")}>
          <div className={cx("answer-item")}>
            <label className={cx("is-correct-lable")}>Đáp án đúng</label>
            <label className={cx("answer-lable")}>Nội dung câu trả lời</label>
          </div>
          <div className={cx("answer-item")}>
            <div className={cx("is-correct")}>
              <div
                className={cx("is-correct-out")}
                onClick={() => {
                  handleIsCorrectSelected(0);
                }}
              >
                {formData.answers[0].is_correct && (
                  <div className={cx("is-correct-in")}></div>
                )}
              </div>
            </div>
            <textarea
              className={cx("answer")}
              onChange={(e) => {
                handleAnswerChange(e, 0);
              }}
            />
          </div>
          <div className={cx("answer-item")}>
            <div className={cx("is-correct")}>
              <div
                className={cx("is-correct-out")}
                onClick={() => {
                  handleIsCorrectSelected(1);
                }}
              >
                {formData.answers[1].is_correct && (
                  <div className={cx("is-correct-in")}></div>
                )}
              </div>
            </div>
            <textarea
              className={cx("answer")}
              onChange={(e) => {
                handleAnswerChange(e, 1);
              }}
            />
          </div>
          <div className={cx("answer-item")}>
            <div className={cx("is-correct")}>
              <div
                className={cx("is-correct-out")}
                onClick={() => {
                  handleIsCorrectSelected(2);
                }}
              >
                {formData.answers[2].is_correct && (
                  <div className={cx("is-correct-in")}></div>
                )}
              </div>
            </div>
            <textarea
              className={cx("answer")}
              onChange={(e) => {
                handleAnswerChange(e, 2);
              }}
            />
          </div>
          <div className={cx("answer-item")}>
            <div className={cx("is-correct")}>
              <div
                className={cx("is-correct-out")}
                onClick={() => {
                  handleIsCorrectSelected(3);
                }}
              >
                {formData.answers[3].is_correct && (
                  <div className={cx("is-correct-in")}></div>
                )}
              </div>
            </div>
            <textarea
              className={cx("answer")}
              onChange={(e) => {
                handleAnswerChange(e, 3);
              }}
            />
          </div>
        </div>
        <div className={cx("btn-add")}>
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
}

export default MakeQuestion;
