import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Exam.module.scss";
import { getAllExamsBySubSubjectIdAPI } from "../../Api/api";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";

const cx = classNames.bind(styles);

function Exam({
  user,
  setIdExam,
  setTimeExam,
  selectedSubject,
  setSelectedContent,
  setHeaderTitle,
  setQuestionsExam,
}) {
  // Lưu danh sách đề thi tương ứng với môn học đã chọn
  const [exams, setExams] = useState([]);

  // useEffect: gọi API để lấy danh sách đề khi selectedSubject thay đổi
  useEffect(() => {
    const getExams = async () => {
      const data = await getAllExamsBySubSubjectIdAPI(selectedSubject);
      setExams(data); // Cập nhật danh sách đề thi
    };

    getExams();
  }, [selectedSubject]);

  // Xử lý khi người dùng click "Làm bài"
  const handleClickDoExam = (idExam, nameExam, timeExam, questionExam) => {
    if (!user) {
      // Nếu chưa đăng nhập, hiển thị cảnh báo
      showConfirmDialog(
        "Bạn chưa đăng nhập",
        "Lịch sử làm bài sẽ không được lưu",
        "info",
        () => {
          // Cho phép làm bài nhưng không lưu lịch sử
          handleDoExam(idExam, nameExam, timeExam, questionExam);
        },
        "Đồng ý",
        "Hủy"
      );
    } else {
      // Nếu đã đăng nhập, cho làm bài như bình thường
      handleDoExam(idExam, nameExam, timeExam, questionExam);
    }
  };

  // xử lý bấm làm bài
  const handleDoExam = (idExam, nameExam, timeExam, questionExam) => {
    setSelectedContent("doExam");
    setIdExam(idExam);
    setHeaderTitle(nameExam);
    setTimeExam(timeExam);
    setQuestionsExam(questionExam);
  };

  return (
    <div className={cx("exam-container")}>
      {/* Hiển thị danh sách đề thi */}
      {exams.length > 0 ? (
        exams.map((exam) => (
          <div key={exam.exam_id} className={cx("exam-card")}>
            {/* Tên đề thi */}
            <h3 className={cx("exam-title")}>{exam.title}</h3>

            {/* Mô tả đề thi */}
            <p className={cx("exam-description")}>{exam.description}</p>

            {/* Nút làm bài */}
            <button
              className={cx("exam-button")}
              onClick={() =>
                handleClickDoExam(
                  exam.exam_id,
                  exam.title,
                  exam.time,
                  exam.Questions
                )
              }
            >
              Làm bài
            </button>
          </div>
        ))
      ) : (
        // Nếu không có đề thi
        <p className={cx("no-exam")}>Không có đề thi nào!</p>
      )}
    </div>
  );
}

export default Exam;
