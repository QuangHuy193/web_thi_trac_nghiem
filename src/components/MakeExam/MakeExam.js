import classNames from "classnames/bind";
import styles from "./MakeExam.module.scss";
import { useEffect, useState } from "react";
import {
  getQUestionBySubSubjectIdAPI,
  getSubjectsAPI,
  getSubSubjectsAPI,
} from "../../Api/api";
import { getDifficultyLabel } from "../../Utils/function";
import { showErrorToast } from "../../Utils/ToastNotification";

const cx = classNames.bind(styles);

function MakeExam() {
  const [subjects, setSubjects] = useState([]);
  const [subSubjects, setSubSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubSubject, setSelectedSubSubject] = useState(null);
  const [questions, setQuestions] = useState({});

  const [exam, setExam] = useState({
    exam_name: "",
    subsubject_id: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    const getSubject = async () => {
      const subjectResult = await getSubjectsAPI();

      setSubjects(subjectResult);
    };

    getSubject();
  }, []);

  useEffect(() => {
    const getSubSubject = async () => {
      const subSubjectResult = await getSubSubjectsAPI();

      setSubSubjects(subSubjectResult);
    };

    getSubSubject();
  }, []);

  useEffect(() => {
    if (selectedSubSubject) {
      const fetchQuestions = async () => {
        const questionResult = await getQUestionBySubSubjectIdAPI(
          selectedSubSubject
        );
        setQuestions(questionResult);
      };
      fetchQuestions();
    } else {
      setQuestions({});
    }
  }, [selectedSubSubject]);

  const filteredSubSubjects = selectedSubject
    ? subSubjects.filter((sub) => sub.subject_id === selectedSubject)
    : [];

  const handleExamChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = (questionId) => {
    if (!exam.questions.includes(questionId)) {
      setExam((prev) => ({
        ...prev,
        questions: [...prev.questions, questionId],
      }));
      console.log(exam.questions);
    }
  };

  const handleRemoveQuestion = (questionId) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.filter((id) => id !== questionId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorMessage = "";

    if (!selectedSubject) {
      errorMessage = "Vui lòng chọn môn học!";
    } else if (!selectedSubSubject) {
      errorMessage = "Vui lòng chọn môn phân lớp!";
    } else if (!exam.exam_name) {
      errorMessage = "Vui lòng nhập tên cho đề thi";
    } else if (!exam.description) {
      errorMessage = "Vui lòng nhập mô tả cho đề thi";
    } else if (exam.questions.length === 0) {
      errorMessage = "Bạn chưa thêm bất kỳ câu hỏi nào cho đề thi!";
    }

    if (errorMessage) {
      showErrorToast(errorMessage, 1200);
      return;
    }
    console.log("Bài thi được tạo:", exam);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("subject-container")}>
        {/* Dropdown chọn Subject */}
        {Array.isArray(subjects) && subjects.length !== 0 && (
          <select
            className={cx("select")}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
          >
            <option value="">Chọn môn học</option>
            {subjects.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.name}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown chọn subSubject */}
        <select
          className={cx("select")}
          onChange={(e) => {
            setSelectedSubSubject(e.target.value);
            setExam({ ...exam, subsubject_id: e.target.value });
          }}
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

      {/* Form tạo bài thi */}
      <form className={cx("form-group")} onSubmit={handleSubmit}>
        <input
          type="text"
          name="exam_name"
          placeholder="Tên bài thi"
          value={exam.exam_name}
          onChange={handleExamChange}
          className={cx("input")}
        />
        <textarea
          name="description"
          placeholder="Mô tả bài thi"
          value={exam.description}
          onChange={handleExamChange}
          className={cx("textarea")}
        />
        <button type="submit" className={cx("submit-button")}>
          Tạo bài thi
        </button>
      </form>

      <div className={cx("question-container")}>
        {/* Danh sách câu hỏi từ API */}
        <div className={cx("question-list")}>
          <h3 className={cx("title")}>Danh sách câu hỏi:</h3>
          {questions?.questions?.length > 0 && (
            <ul>
              {questions.questions.map((question) => (
                <li key={question.question_id} className={cx("question-item")}>
                  <div>
                    <strong>{question.question_text}</strong>
                    <span>
                      Độ khó: {getDifficultyLabel(question.difficulty)}
                    </span>
                  </div>
                  <span>
                    <button
                      className={cx("add-button")}
                      onClick={() => handleAddQuestion(question.question_id)}
                    >
                      Thêm
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Danh sách câu hỏi đã chọn */}
        <div className={cx("selected-questions")}>
          <h3 className={cx("title")}>Câu hỏi đã chọn:</h3>
          {exam.questions.length > 0 && (
            <ul>
              {exam.questions.map((qId) => {
                const question = questions.questions.find(
                  (q) => q.question_id === qId
                );
                return question ? (
                  <li key={qId} className={cx("question-item")}>
                    <div>
                      <strong>{question.question_text}</strong>
                      <span>
                        Độ khó: {getDifficultyLabel(question.difficulty)}
                      </span>
                    </div>
                    <span>
                      <button
                        className={cx("remove-button")}
                        onClick={() =>
                          handleRemoveQuestion(question.question_id)
                        }
                      >
                        Xóa
                      </button>
                    </span>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MakeExam;
