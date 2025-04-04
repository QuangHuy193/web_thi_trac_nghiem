import classNames from "classnames/bind";

import styles from "./ListExam.module.scss";
import { useEffect, useState } from "react";
import { getAllExamsByUserIdAPI } from "../../Api/api";

const cx = classNames.bind(styles);

function ListExam({ user, setHeaderTitle, setSelectedContent, setExamEdited }) {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const getExamByUserId = async () => {
      const results = await getAllExamsByUserIdAPI(user.user_id);
      setExams(results);
    };

    getExamByUserId();
  }, []);

  const handleDelete = (examId) => {
    // setExams(exams.filter((exam) => exam.id !== examId));
  };

  const handleEdit = (exam) => {
    console.log("Sửa bài thi", exam);
    setHeaderTitle("Sửa bài thi")
    setSelectedContent("makeExam")
    setExamEdited(exam);
  };

  return (
    <div className={cx("exam-list")}>
      {exams.length === 0 ? (
        <p className={cx("no-exams")}>Không có bài thi nào.</p>
      ) : (
        <ul className={cx("exam-container")}>
          {exams.map((exam) => (
            <li key={exam.exam_id} className={cx("exam-item")}>
              <h3 className={cx("exam-title")}>{exam.title}</h3>
              <p className={cx("exam-description")}>{exam.description}</p>
              <p className={cx("exam-time")}>
                <strong>Thời gian:</strong> {exam.time} phút
              </p>
              <div className={cx("exam-actions")}>
                <button
                  onClick={() => handleEdit(exam)}
                  className={cx("edit-btn")}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(exam.id)}
                  className={cx("delete-btn")}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListExam;
