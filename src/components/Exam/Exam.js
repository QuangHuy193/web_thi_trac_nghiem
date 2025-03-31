import { useEffect, useState } from "react";
import styles from "./Exam.module.scss";

import classNames from "classnames/bind";
import { getAllExamsBySubSubjectId } from "../../Api/api";

const cx = classNames.bind(styles);

function Exam({ selectedSubject, setSelectedContent, setHeaderTitle }) {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const getExams = async () => {
      const data = await getAllExamsBySubSubjectId(selectedSubject);
      setExams(data);
    };

    getExams();
  }, [selectedSubject]);

  const handleClickDoExam = (content, nameExam) => {
    setSelectedContent("doExam");
    setHeaderTitle(nameExam);
  };

  return (
    <div className={cx("exam-container")}>
      {exams.length > 0 ? (
        exams.map((exam) => (
          <div key={exam.exam_id} className={cx("exam-card")}>
            <h3 className={cx("exam-title")}>{exam.title}</h3>
            <p className={cx("exam-description")}>{exam.description}</p>
            <button
              className={cx("exam-button")}
              onClick={() => handleClickDoExam("doExam", exam.title)}
            >
              Làm bài
            </button>
          </div>
        ))
      ) : (
        <p className={cx("no-exam")}>Không có đề thi nào!</p>
      )}
    </div>
  );
}

export default Exam;
