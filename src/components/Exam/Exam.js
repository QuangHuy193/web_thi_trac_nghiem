import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Exam.module.scss";
import { getAllExamsBySubSubjectIdAPI } from "../../Api/api";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";
import { removeVietnameseTones } from "../../Utils/function";

const cx = classNames.bind(styles);

function Exam({
  user,
  setIdExam,
  setTimeExam,
  selectedSubject,
  setSelectedContent,
  setHeaderTitle,
  setQuestionsExam,
  searchValue,
  setIsLoading,
  setTitleLoading,
}) {
  // Lưu danh sách đề thi tương ứng với môn học đã chọn
  const [exams, setExams] = useState([]);

  const [isFetchDone, setIsFetchDone] = useState(false);

  // useEffect: gọi API để lấy danh sách đề khi selectedSubject thay đổi
  useEffect(() => {
    const getExams = async () => {
      setTitleLoading("Đang tải danh sách bài thi...");
      setIsLoading(true);
      const data = await getAllExamsBySubSubjectIdAPI(selectedSubject);
      setIsLoading(false);
      setIsFetchDone(true);

      // Cập nhật danh sách đề thi
      if (!searchValue) {
        setExams(data);
      } else {
        const keyword = removeVietnameseTones(searchValue);

        const filtered = data.filter((exam) => {
          const examName = removeVietnameseTones(exam.title);
          return examName.includes(keyword);
        });

        setExams(filtered);
      }
    };
    getExams();
  }, [selectedSubject, searchValue]);

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
      {isFetchDone ? (
        exams.length > 0 ? (
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
                    exam.question
                  )
                }
              >
                Làm bài
              </button>
            </div>
          ))
        ) : (
          // Nếu không có đề thi
          <div className={cx("no-content")}>Không có đề thi nào!</div>
        )
      ) : null}
    </div>
  );
}

export default Exam;
