import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Exam.module.scss";
import { getAllExamsBySubSubjectIdAPI } from "../../Api/api";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";

const cx = classNames.bind(styles);

function Exam({
  user,
  setIdExam,
  selectedSubject,
  setSelectedContent,
  setHeaderTitle,
}) {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const getExams = async () => {
      const data = await getAllExamsBySubSubjectIdAPI(selectedSubject);
      setExams(data);
    };

    getExams();
  }, [selectedSubject]);

  const handleClickDoExam = (idExam, nameExam) => {
    if (!user) {
      showConfirmDialog(
        "Bạn chưa đăng nhập",
        "Lịch sử làm bài sẽ không được lưu",
        "info",
        () => {
          setSelectedContent("doExam");
          setIdExam(idExam);
          setHeaderTitle(nameExam);
        },
        "Đồng ý",
        "Hủy"
      );
    } else {
      setSelectedContent("doExam");
      setIdExam(idExam);
      setHeaderTitle(nameExam);
    }
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
              onClick={() => handleClickDoExam(exam.exam_id, exam.title)}
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
