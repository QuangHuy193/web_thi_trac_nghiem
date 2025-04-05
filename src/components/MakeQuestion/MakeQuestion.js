import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import styles from "./MakeQuestion.module.scss";
import { getSubSubjectsAPI, makeQuestionAPI } from "../../Api/api";
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
  // tên môn phân lớp để hiển thi
  const [subSubjectName, setSubSubjectName] = useState("");
  // State lưu thông tin câu hỏi và danh sách đáp án
  const [formData, setFormdata] = useState({
    subject_id: selectedSubSubject, // Môn học con được chọn
    question_text: "", // Nội dung câu hỏi
    difficulty: "", // Độ khó
    created_by: user.user_id, // ID người tạo (user hiện tại)
    answers: [{}, {}, {}, {}], // 4 đáp án mặc định (rỗng)
  });

  // lấy tên môn phân lớp
  useEffect(() => {
    const getSubSubject = async () => {
      const rs = await getSubSubjectsAPI();
      console.log(rs);
      for (let index = 0; index < rs.length; index++) {
        if (rs[index].subsubjects_id == selectedSubSubject) {
          setSubSubjectName(rs[index].subject_name);
          return;
        }
      }
    };

    getSubSubject();
  }, []);

  // Xử lý khi người dùng nhập nội dung câu hỏi
  const handleQuestionChange = (e) => {
    setFormdata({ ...formData, question_text: e.target.value });
  };

  // Xử lý khi người dùng chọn độ khó
  const handleDifficultyicultyChange = (e) => {
    setFormdata({ ...formData, difficulty: e.target.value });
  };

  // Xử lý khi người dùng thay đổi nội dung đáp án
  const handleAnswerChange = (e, index) => {
    const { value } = e.target;
    const newAnswers = [...formData.answers];
    newAnswers[index] = {
      ...newAnswers[index],
      answer_text: value,
    };
    setFormdata((prevData) => ({
      ...prevData,
      answers: newAnswers,
    }));
  };

  // Xử lý chọn đáp án đúng (chỉ 1 đáp án đúng duy nhất)
  const handleIsCorrectSelected = (index) => {
    const newAnswers = formData.answers.map((answer, i) => ({
      ...answer,
      is_correct: i === index, // chỉ 1 đáp án là đúng
    }));
    setFormdata((prevData) => ({
      ...prevData,
      answers: newAnswers,
    }));
  };

  // Đóng form tạo câu hỏi
  const handleCloseForm = () => {
    setIsMakeQuestion(false);
  };

  // Gửi dữ liệu tạo câu hỏi
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errMessage = "";

    // kiểm tra lỗi trước khi gửi lên server
    if (!formData.question_text) {
      errMessage = "Bạn chưa nhập câu hỏi!";
    } else if (!formData.difficulty) {
      errMessage = "Bạn chưa chọn độ khó cho câu hỏi!";
    } else if (
      formData.answers.some(
        (ans) => !ans.answer_text || ans.answer_text.trim() === ""
      )
    ) {
      errMessage = "Tất cả đáp án đều phải được nhập!";
    } else if (!formData.answers.some((ans) => ans.is_correct)) {
      errMessage = "Bạn chưa chỉ định đâu là đáp án đúng!";
    }

    if (errMessage) {
      showErrorToast(errMessage, 1200);
    } else {
      try {
        const result = await makeQuestionAPI(
          formData.subject_id,
          formData.question_text,
          formData.difficulty,
          formData.created_by,
          formData.answers
        );

        if (result.question) {
          showSuccessToast("Tạo câu hỏi thành công!", 1200);
          setIsMakeQuestion(false); // đóng form
          setRefreshQuestion((prev) => !prev); // làm mới danh sách câu hỏi
        } else {
          showErrorToast(result.message, 1200);
        }
      } catch (error) {
        showErrorToast("Có lỗi xảy ra, vui lòng thử lại...", 1200);
      }
    }
  };

  return (
    <div className={cx("container")}>
      <form className={cx("form")}>
        {/* Icon đóng form */}
        <div className={cx("icon-close")}>
          <FontAwesomeIcon icon={faClose} onClick={handleCloseForm} />
        </div>

        {/* Tiêu đề form */}
        <div className={cx("title-group")}>
          <label className={cx("title")}>
            Thêm câu hỏi cho môn {" " + subSubjectName}
          </label>
        </div>

        {/* Nhập nội dung câu hỏi */}
        <div className={cx("question-group")}>
          <label>Nhập nội dung câu hỏi:</label>
          <textarea
            className={cx("question")}
            onChange={handleQuestionChange}
          />
        </div>

        {/* Chọn độ khó */}
        <div className={cx("difficulty-group")}>
          <label>Độ khó của câu hỏi:</label>
          <select onChange={handleDifficultyicultyChange}>
            <option value="">--chọn độ khó--</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>

        {/* Nhập 4 đáp án */}
        <div className={cx("answer-group")}>
          {/* Nhãn đáp án */}
          <div className={cx("answer-item")}>
            <label className={cx("is-correct-lable")}>Đáp án đúng</label>
            <label className={cx("answer-lable")}>Nội dung câu trả lời</label>
          </div>

          {/* Lặp 4 đáp án */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cx("answer-item")}>
              <div className={cx("is-correct")}>
                <div
                  className={cx("is-correct-out")}
                  onClick={() => handleIsCorrectSelected(i)}
                >
                  {formData.answers[i].is_correct && (
                    <div className={cx("is-correct-in")}></div>
                  )}
                </div>
              </div>
              <textarea
                className={cx("answer")}
                onChange={(e) => handleAnswerChange(e, i)}
              />
            </div>
          ))}
        </div>

        {/* Nút thêm câu hỏi */}
        <div className={cx("btn-add")}>
          <button onClick={handleSubmit}>Thêm</button>
        </div>
      </form>
    </div>
  );
}

export default MakeQuestion;
