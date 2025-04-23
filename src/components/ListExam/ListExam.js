import classNames from "classnames/bind";

import styles from "./ListExam.module.scss";
import { useEffect, useState } from "react";
import { deleteExamsByExamIdAPI, getAllExamsByUserIdAPI } from "../../Api/api";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";

const cx = classNames.bind(styles);

function ListExam({
  user,
  setHeaderTitle,
  setSelectedContent,
  setExamEdited,
  setIsLoading,
  setTitleLoading,
}) {
  // State lưu danh sách đề thi của người dùng
  const [exams, setExams] = useState([]);
  // lưu để gọi lại api lấy exam
  const [isChangeExam, setIsChangeExam] = useState(false);

  const [isFetchDone, setIsFetchDone] = useState(false);

  // Lấy danh sách đề thi của user khi component được mount
  useEffect(() => {
    const getExamByUserId = async () => {
      setTitleLoading("Đang tải danh sách bài thi đã tạo...");
      setIsLoading(true);
      const results = await getAllExamsByUserIdAPI(user.user_id);
      setIsLoading(false);
      setIsFetchDone(true);
      setExams(results);
    };

    getExamByUserId();
  }, [isChangeExam]); // chỉ chạy một lần khi component render

  // Hàm xử lý xóa đề thi (chưa cài đặt logic xóa thực tế)
  const handleDelete = async (examId) => {
    showConfirmDialog(
      "Bạn chắc chắn chứ?",
      "Bạn đang thực hiện xóa bài thi, việc này không thể hoàn tác!",
      "warning",
      async () => {
        try {
          setTitleLoading("Đang xóa bài thi...");
          setIsLoading(true);
          const response = await deleteExamsByExamIdAPI(examId);
          setIsLoading(false);

          if (response.deleted) {
            showSuccessToast(response.message, 1200);
            setIsChangeExam(!isChangeExam);
          } else {
            showErrorToast(response.message, 1200);
          }
        } catch (error) {
          showErrorToast("Có lỗi xảy ra, vui lòng thử lại...", 1200);
        }
      },
      "Có",
      "Không"
    );
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
      {isFetchDone ? (
        exams.length === 0 ? (
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
                    onClick={() => handleDelete(exam.exam_id)}
                    className={cx("delete-btn")}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}

export default ListExam;
