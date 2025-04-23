import classNames from "classnames/bind";

import styles from "./MakeQuestion.module.scss";
import { useEffect, useRef, useState } from "react";
import { getSubjectsAPI, getSubSubjectsAPI, makeQuestionAPI } from "../../Api/api";
import { showErrorToast, showSuccessToast } from "../../Utils/ToastNotification";
import { SPECIAL_CHAR } from "../../Utils/const";

const cx = classNames.bind(styles);

function MakeQuestion({
  user,
  setIsLoading,
  setTitleLoading,
  setSelectedContent,
  setHeaderTitle,
}) {
  // ds môn chính
  const [subjects, setSubjects] = useState([]);
  // ds môn phân lớp
  const [subSubjects, setSubSubjects] = useState([]);
  // môn chính đang dc chọn trên select-option
  const [selectedSubject, setSelectedSubject] = useState(null);
  // form thêm
  const [formData, setFormdata] = useState({
    subject_id: "",
    question_text: "",
    difficulty: "",
    created_by: user.user_id,
    answers: [{}, {}, {}, {}],
  });

  const textareaRef = useRef(null); // ref lưu textarea đang focus

  // lấy ds môn học từ API
  useEffect(() => {
    const getSubject = async () => {
      const subjectResult = await getSubjectsAPI();

      setSubjects(subjectResult);
    };

    getSubject();
  }, []);

  // lấy môn phân lớp từ API
  useEffect(() => {
    const getSubSubject = async () => {
      const subSubjectResult = await getSubSubjectsAPI();
      setSubSubjects(subSubjectResult);
    };

    getSubSubject();
  }, []);

  //xử lý thay đổi của dropdown subsubject
  const handleChangeSubSUbject = (e) => {
 
    setFormdata({ ...formData, subject_id: e.target.value });
    console.log(formData);
  };

  // dùng để lấy ds môn phân lơp theo môn học chính dc chọn
  const filteredSubSubjects = selectedSubject
    ? subSubjects.filter((sub) => sub.subject_id === selectedSubject)
    : [];

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

  const handleDifficultyicultyChange = (e) => {
    setFormdata({ ...formData, difficulty: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setFormdata({ ...formData, question_text: e.target.value });
  };

  const handleIsCorrectSelected = (index) => {
    const newAnswers = formData.answers.map((answer, i) => ({
      ...answer,
      is_correct: i === index,
    }));
    setFormdata((prevData) => ({
      ...prevData,
      answers: newAnswers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errMessage = "";

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
        setTitleLoading("Đang tạo câu hỏi...");
        setIsLoading(true);
        const result = await makeQuestionAPI(
          formData.subject_id,
          formData.question_text,
          formData.difficulty,
          formData.created_by,
          formData.answers
        );
        setIsLoading(false);

        if (result.question) {
          showSuccessToast("Tạo câu hỏi thành công!", 1200);
          setHeaderTitle("Danh sách câu hỏi đã tạo");
          setSelectedContent("listQuestion");
        } else {
          showErrorToast(result.message, 1200);
        }
      } catch (error) {
        showErrorToast("Có lỗi xảy ra, vui lòng thử lại...", 1200);
      }
    }
  };

  // 📌 Hàm chèn ký tự đặc biệt vào textarea đang focus
  const handleInsertSpecialChar = (char) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue = value.slice(0, start) + char + value.slice(end);

    textarea.value = newValue;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + char.length;

    // Gọi handleAnswerChange thủ công
    const index = textarea.dataset.index;
    handleAnswerChange({ target: { value: newValue } }, Number(index));
  };

  return (
    <div className={cx("container")}>
      <div className={cx("subject-container")}>
        {/* Dropdown chọn Subject */}
        <select
          className={cx("select")}
          onChange={(e) => setSelectedSubject(Number(e.target.value))}
          value={selectedSubject}
        >
          <option value="">Chọn môn học</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.name}
            </option>
          ))}
        </select>

        {/* Dropdown chọn subSubject */}
        <select
          className={cx("select")}
          onChange={(e) => handleChangeSubSUbject(e)}      
        >
          <option value="">Chọn môn phân lớp</option>
          {filteredSubSubjects.map((subSubject) => (
            <option
              key={subSubject.subsubjects_id}
              value={subSubject.subsubjects_id}
            >
              {subSubject.subject_name}
            </option>
          ))}
        </select>
      </div>
      <div className={cx("question-group")}>
        <label>Nhập nội dung câu hỏi:</label>
        <textarea
          className={cx("question")}
          onChange={handleQuestionChange}
          onFocus={(e) => (textareaRef.current = e.target)}
        />
      </div>

      {/* Bàn phím ký tự đặc biệt */}
      <div className={cx("special-keyboard")}>
        {SPECIAL_CHAR.map((char) => (
          <button
            key={char}
            type="button"
            className={cx("special-key")}
            onClick={() => handleInsertSpecialChar(char)}
          >
            {char}
          </button>
        ))}
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
              onFocus={(e) => (textareaRef.current = e.target)}
              data-index={i}
            />
          </div>
        ))}
      </div>

      <div className={cx("btn-add")}>
        <button onClick={handleSubmit}>Thêm</button>
      </div>
    </div>
  );
}

export default MakeQuestion;
