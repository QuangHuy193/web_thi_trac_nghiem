import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPlusCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./MakeExam.module.scss";
import {
  getQuestionBySubSubjectIdAPI,
  getSubjectsAPI,
  getSubSubjectsAPI,
  makeExamAPI,
  updateExamByExamIdAPI,
} from "../../apis";

import { getDifficultyLabel, handleBack } from "../../Utils/function";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import MakeQuestionPopup from "../MakeQuestionPopup/MakeQuestionPopup";
import IconBack from "../IconBack/IconBack";
import TippyCustom from "../TippyCustom/TippyCustom";

const cx = classNames.bind(styles);

function MakeExam({
  user,
  setSelectedContent,
  setHeaderTitle,
  examEdited,
  setIsLoading,
  setTitleLoading,
}) {
  // ds môn chính
  const [subjects, setSubjects] = useState([]);
  // ds môn phân lớp
  const [subSubjects, setSubSubjects] = useState([]);
  // môn chính đang dc chọn trên select-option
  const [selectedSubject, setSelectedSubject] = useState(null);
  // môn phân lớp đang dc chọn trên select-option
  const [selectedSubSubject, setSelectedSubSubject] = useState(null);
  // ds câu hỏi lấy theo môn phân lớp
  const [questions, setQuestions] = useState({});
  // mở hộp thoại thêm câu hỏi
  const [isMakeQuestion, setIsMakeQuestion] = useState(false);
  // dùng để làm mới ds câu hỏi của môn phân lớp khi thêm mới câu hỏi
  const [refreshQuestion, setRefreshQuestion] = useState(false);
  // bộ lọc câu hỏi theo độ khó
  const [filterSelectd, setFilterSelected] = useState("all");
  // ds câu hỏi khi lọc, nếu không lọc hiển thị tất cả
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  // ds các độ khó
  const difficulties = ["all", "easy", "medium", "hard"];
  // thông tin để tạo bài thi mới
  const [exam, setExam] = useState({
    exam_name: "",
    subsubject_id: "",
    created_id: user.user_id,
    description: "",
    time: 0,
    questions: [],
  });
  // hiện search
  const [isSearch, setIsSearch] = useState(false);
  //lưu nội dung search
  const [contentSearch, setContentSearch] = useState("");

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

  // lấy câu hỏi từ API theo môn phân lớp
  useEffect(() => {
    if (selectedSubSubject) {
      const fetchQuestions = async () => {
        const questionResult = await getQuestionBySubSubjectIdAPI(
          selectedSubSubject
        );

        // Lọc bỏ các câu hỏi đã có trong exam.questions
        const filtered = {
          ...questionResult,
          questions: questionResult.questions?.filter(
            (q) => !exam.questions.includes(q.question_id)
          ),
        };

        setQuestions(questionResult);
        setFilteredQuestions(filtered); // Cập nhật lại filteredQuestions
      };

      fetchQuestions();
    } else {
      setQuestions({});
    }
  }, [selectedSubSubject, refreshQuestion]); // Không phụ thuộc vào exam.questions nữa

  //xử lý khi cập nhật exam
  useEffect(() => {
    if (examEdited && Object.keys(examEdited).length !== 0) {
      // Cập nhật state exam từ examEdited
      setExam((prev) => ({
        ...prev,
        exam_name: examEdited.title || "",
        subsubject_id: examEdited.subsubject_id || "",
        description: examEdited.description || "",
        created_id: user.user_id,
        time: examEdited.time || "",
        questions: examEdited.question
          ? examEdited.question.map((q) => q.question_id)
          : [],
      }));

      setSelectedSubSubject(examEdited.subsubject_id);

      const subSubject = subSubjects.find(
        (item) => item.subsubjects_id === examEdited.subsubject_id
      );

      if (subSubject) {
        setSelectedSubject(subSubject.subject_id);
      }
    }
  }, [examEdited, subSubjects]);

  //reset từ cập nhật sang thêm
  useEffect(() => {
    if (!examEdited) {
      setSelectedSubject("");
      setSelectedSubSubject("");
      setExam({
        exam_name: "",
        subsubject_id: "",
        created_id: user.user_id,
        description: "",
        time: "",
        questions: [],
      });
      setFilteredQuestions({});
    }
  }, [examEdited]);

  // dùng để lấy ds môn phân lơp theo môn học chính dc chọn
  const filteredSubSubjects = selectedSubject
    ? subSubjects.filter((sub) => sub.subject_id === selectedSubject)
    : [];

  // thực hiện khi change các thông tin trên form
  const handleExamChange = (e) => {
    const { name, value } = e.target;

    setExam({ ...exam, [name]: value });

    if (name === "time") {
      let newValue = parseInt(value, 10);
      if (isNaN(newValue) || newValue < 1) newValue = 1; // Giới hạn tối thiểu
      if (newValue > 120) newValue = 120; // Giới hạn tối đa

      setExam({ ...exam, [name]: newValue });
    } else {
      setExam({ ...exam, [name]: value });
    }
  };

  // thêm câu hỏi vào form
  const handleAddQuestion = (questionId) => {
    if (!exam.questions.includes(questionId)) {
      // Thêm câu hỏi vào exam
      setExam((prev) => ({
        ...prev,
        questions: [...prev.questions, questionId],
      }));

      // Cập nhật lại filteredQuestions sau khi thêm câu hỏi vào exam
      setFilteredQuestions((prev) => {
        // Xoá câu hỏi khỏi filteredQuestions
        const updatedQuestions = prev.questions.filter(
          (q) => q.question_id !== questionId
        );

        // Trả về filteredQuestions đã được cập nhật
        return { ...prev, questions: updatedQuestions };
      });
    }
  };

  // xóa câu hỏi khỏi form
  const handleRemoveQuestion = (questionId) => {
    const removedQuestion = questions.questions.find(
      (q) => q.question_id === questionId
    );

    if (removedQuestion) {
      // Cập nhật lại danh sách đề
      setExam((prev) => ({
        ...prev,
        questions: prev.questions.filter((id) => id !== questionId),
      }));

      // Thêm lại vào danh sách hiển thị
      setFilteredQuestions((prev) => ({
        ...prev,
        questions: [removedQuestion, ...prev.questions],
      }));
    }
  };

  // mở component thêm câu hỏi
  const handleMakeQuestion = () => {
    setIsMakeQuestion(true);
  };

  // lọc ds câu hỏi theo độ khó và tiềm kiếm
  const handleFilterQuestion = (difficulty) => {
    setFilterSelected(difficulty);

    // Kiểm tra nếu questions đã có dữ liệu
    if (!questions?.questions) return;

    // Lọc các câu hỏi không có trong exam.questions
    let filteredByDifficulty = [];
    if (difficulty === "all") {
      filteredByDifficulty = questions.questions.filter(
        (q) => !exam.questions.includes(q.question_id)
      );
    } else {
      filteredByDifficulty = questions.questions.filter(
        (q) =>
          q.difficulty === difficulty && !exam.questions.includes(q.question_id)
      );
    }

    // Lọc tiếp theo nội dung tìm kiếm (nếu có)
    let finalFiltered = filteredByDifficulty;
    if (contentSearch.trim() !== "") {
      const searchLower = contentSearch.toLowerCase();
      finalFiltered = filteredByDifficulty.filter((q) =>
        q.question_text.toLowerCase().includes(searchLower)
      );
    }

    setFilteredQuestions({ questions: finalFiltered });
  };

  useEffect(() => {
    handleFilterQuestion(filterSelectd);
  }, [contentSearch]);

  useEffect(() => {
    if (!isSearch) {
      setContentSearch("");
    }
  }, [isSearch]);

  //xử lý thay đổi của dropdown subsubject
  const handleChangeSubSUbject = (e) => {
    setSelectedSubSubject(e.target.value);
    setExam({ ...exam, subsubject_id: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
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
    } else if (exam.time === 0) {
      errorMessage = "Bạn chưa nhập thời gian làm bài cho bài thi!";
    } else if (exam.questions.length === 0) {
      errorMessage = "Bạn chưa thêm bất kỳ câu hỏi nào cho đề thi!";
    }

    if (errorMessage) {
      showErrorToast(errorMessage, 1200);
      return;
    }
    try {
      if (!examEdited) {
        setTitleLoading("Đang tạo bài thi...");
        setIsLoading(true);
        const result = await makeExamAPI(
          exam.exam_name,
          exam.description,
          exam.time,
          exam.created_id,
          exam.subsubject_id,
          exam.questions
        );
        setIsLoading(false);

        if (result.exam) {
          showSuccessToast(result.message, 1200);
          setHeaderTitle("Danh Dách bài thi");
          setSelectedContent("listExam");
        } else {
          showErrorToast(result.message || "Không thể tạo bài thi!", 1200);
        }
      } else {
        setTitleLoading("Đang cập nhật bài thi...");
        setIsLoading(true);

        const result = await updateExamByExamIdAPI(
          examEdited.exam_id,
          exam.exam_name,
          exam.description,
          exam.questions,
          exam.time
        );
        setIsLoading(false);

        if (result.status) {
          showSuccessToast(result.message, 1200);
          setSelectedContent("listExam");
          setHeaderTitle("Danh sách bài thi");
        } else {
          showErrorToast(result.message, 1200);
        }
      }
    } catch (error) {
      showErrorToast("Có lỗi xảy ra, vui lòng thử lại...", 1200);
    }
  };

  return (
    <>
      <div className={cx("container")}>
        {examEdited && (
          <IconBack
            handleBack={() =>
              handleBack(
                setHeaderTitle,
                "Danh sách bài thi",
                setSelectedContent,
                "listExam"
              )
            }
          />
        )}
        {/* trang thêm câu hỏi */}
        {isMakeQuestion && (
          <div style={{ position: "relative" }}>
            <MakeQuestionPopup
              setIsMakeQuestion={setIsMakeQuestion}
              user={user}
              selectedSubSubject={selectedSubSubject}
              setRefreshQuestion={setRefreshQuestion}
              setIsLoading={setIsLoading}
              setTitleLoading={setTitleLoading}
            />
          </div>
        )}
        <div className={cx("subject-container")}>
          {/* Dropdown chọn Subject */}
          <select
            className={cx("select", { disable: examEdited })}
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
            value={selectedSubSubject}
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

          {/* Thời gian làm bài */}
          <input
            type="number"
            name="time"
            placeholder="Thời gian làm bài (phút)"
            value={exam.time}
            onChange={handleExamChange}
            className={cx("input")}
            min="1" // Không cho phép nhập số nhỏ hơn 1
          />

          <button type="submit" className={cx("submit-button")}>
            {!examEdited ? "Tạo bài thi" : "Cập nhật bài thi"}
          </button>
        </form>

        <div className={cx("question-container")}>
          {/* Danh sách câu hỏi từ API */}
          <div className={cx("question-list")}>
            <div className={cx("title-group")}>
              <h3 className={cx("title")}>
                Danh sách câu hỏi thuộc môn:{" "}
                {selectedSubSubject &&
                  subSubjects.find(
                    (item) =>
                      Number(item.subsubjects_id) === Number(selectedSubSubject)
                  )?.subject_name}
              </h3>
              {Object.keys(questions).length !== 0 && (
                <TippyCustom content="Thêm câu hỏi" placement="bottom">
                  <span
                    className={cx("icon-plus")}
                    onClick={handleMakeQuestion}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </span>
                </TippyCustom>
              )}
            </div>

            <div className={cx("number-search-group")}>
              <div className={cx("number-question")}>
                Số câu hỏi hiện tại: {filteredQuestions.questions?.length}
              </div>
              {filteredQuestions.questions?.length > 0 && !isSearch && (
                <FontAwesomeIcon
                  className={cx("icon-search")}
                  icon={faSearch}
                  onClick={() => setIsSearch(true)}
                />
              )}
              {isSearch && (
                <FontAwesomeIcon
                  className={cx("icon-close")}
                  icon={faClose}
                  onClick={() => setIsSearch(false)}
                />
              )}
            </div>

            {isSearch && (
              <div className={cx("input-search")}>
                <input
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                />
              </div>
            )}

            {/* lọc câu hỏi */}
            {Object.keys(questions).length !== 0 && (
              <div className={cx("filter-difficuty")}>
                <label className={cx("filter-difficulty-title")}>
                  Lọc độ khó:
                </label>
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    className={cx("filter-difficulty-item", {
                      active: filterSelectd === difficulty,
                    })}
                    onClick={() => handleFilterQuestion(difficulty)}
                  >
                    {getDifficultyLabel(difficulty)}
                  </button>
                ))}
              </div>
            )}

            {/* ds câu hỏi */}
            {filteredQuestions.questions?.length > 0 && (
              <ul>
                {filteredQuestions.questions.map((question) => (
                  <li
                    key={question.question_id}
                    className={cx("question-item")}
                  >
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
            <TippyCustom
              content={"Chỉ hiện câu hỏi của môn được chọn"}
              placement="bottom"
            >
              <h3 className={cx("title")}>
                Câu hỏi đã chọn:{" "}
                {exam.questions.length !== 0 &&
                  "(" + exam.questions.length + ")"}
              </h3>
            </TippyCustom>
            {exam.questions.length > 0 && (
              <ul>
                {exam.questions.map((qId) => {
                  const question = questions.questions?.find(
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
    </>
  );
}

export default MakeExam;
