import classNames from "classnames/bind";

import styles from "./ListExam.module.scss";
import { useEffect, useState } from "react";
import { getAllExamsByUserIdAPI } from "../../Api/api";

const cx = classNames.bind(styles);

function ListExam({ user, setHeaderTitle, setSelectedContent, setExamEdited }) {
  // State lưu danh sách đề thi của người dùng
  const [exams, setExams] = useState([]);

  // Lấy danh sách đề thi của user khi component được mount
  useEffect(() => {
    const getExamByUserId = async () => {
      const results = await getAllExamsByUserIdAPI(user.user_id);
      setExams(results);
    };

    getExamByUserId();
  }, []); // chỉ chạy một lần khi component render

  // Hàm xử lý xóa đề thi (chưa cài đặt logic xóa thực tế)
  const handleDelete = (examId) => {
    // TODO: Thêm logic gọi API để xóa bài thi
    // setExams(exams.filter((exam) => exam.id !== examId));
  };

  // Hàm xử lý sửa đề thi
  const handleEdit = (exam) => {
    setHeaderTitle("Sửa bài thi"); // đổi tiêu đề header
    setSelectedContent("makeExam"); // điều hướng tới trang tạo đề
    setExamEdited(exam); // truyền dữ liệu đề thi được chọn để sửa
  };

  return (
    <div className={cx("exam-list")}>
      {/* Hiển thị khi không có đề thi */}
      {exams.length === 0 ? (
        <p className={cx("no-exams")}>Bạn chưa tạo bài thi nào.</p>
      ) : (
        // Hiển thị danh sách các đề thi
        <ul className={cx("exam-container")}>
          {exams.map((exam) => (
            <li key={exam.exam_id} className={cx("exam-item")}>
              <h3 className={cx("exam-title")}>{exam.title}</h3>
              <p className={cx("exam-description")}>{exam.description}</p>
              <p className={cx("exam-time")}>
                <strong>Thời gian:</strong> {exam.time} phút
              </p>
              <div className={cx("exam-actions")}>
                {/* Nút sửa bài thi */}
                <button
                  onClick={() => handleEdit(exam)}
                  className={cx("edit-btn")}
                >
                  Sửa
                </button>
                {/* Nút xóa bài thi */}
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
