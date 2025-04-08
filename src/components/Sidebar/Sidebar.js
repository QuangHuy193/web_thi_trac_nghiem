import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import styles from "./Sidebar.module.scss";
import { showErrorToast } from "../../Utils/ToastNotification";
import { getAllSubjectsAPI } from "../../Api/api";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  expandCollapseMotion,
  fadeSlideIn,
  rotateArrow,
} from "../../Utils/motionConfigs";

const cx = classNames.bind(styles);

function Sidebar({
  selectedContent,
  setSelectedContent,
  setSelectedSubject,
  setHeaderTitle,
  user,
  setExamEdited,
}) {
  // State lưu trữ trạng thái hiển thị danh sách môn học (Hiện/Ẩn)
  const [showSubjects, setShowSubjects] = useState(false);

  // State lưu trữ môn học đang được chọn (Để quản lý việc mở/đóng dropdown)
  const [activeSubject, setActiveSubject] = useState(null);

  // State lưu trữ danh sách môn học được fetch từ API
  const [subjects, setSubjects] = useState([]);

  // Lấy danh sách môn học từ API khi component được mount
  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getAllSubjectsAPI(); // Gọi API lấy danh sách môn học
      setSubjects(data); // Cập nhật state subjects
    };

    fetchSubjects(); // Gọi hàm lấy dữ liệu
  }, []); // Chạy 1 lần khi component được mount

  // Kiểm tra người dùng đã đăng nhập chưa trước khi thao tác
  const handleCheckLogin = (selected, titlePage) => {
    if (user) {
      // Nếu đang làm bài thi, yêu cầu xác nhận trước khi chuyển trang
      if (selectedContent === "doExam") {
        showConfirmDialog(
          "Bạn có muốn tiếp tục?",
          "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn, bạn vẫn muốn tiếp tục",
          "warning",
          () => {
            handleSetSelectedContent(selected, titlePage);
          },
          "Tiếp tục",
          "Không"
        );
      } else {
        handleSetSelectedContent(selected, titlePage); // Nếu không đang làm bài thi, trực tiếp chuyển trang
      }
    } else {
      showErrorToast("Bận cần đăng nhập để thực hiện chức năng này!", 1500); // Thông báo nếu chưa đăng nhập
    }
  };

  // Cập nhật nội dung và tiêu đề khi menu được chọn
  const handleSetSelectedContent = (selected, titlePage) => {
    setSelectedContent(selected); // Cập nhật nội dung đã chọn
    setHeaderTitle(titlePage); // Cập nhật tiêu đề trang
    setExamEdited(null); // Reset trạng thái chỉnh sửa bài thi
  };

  // Cập nhật môn học được chọn và chuyển đến subsubject khi người dùng chọn môn học
  const handleSelectdSubject = (selected, subject_id, subsubject_name) => {
    if (selectedContent === "doExam") {
      // Nếu đang làm bài thi, yêu cầu xác nhận trước khi chuyển trang
      showConfirmDialog(
        "Bạn có muốn tiếp tục?",
        "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn, bạn vẫn muốn tiếp tục",
        "warning",
        () => {
          setSelectedSubject(subject_id);
          setSelectedContent(selected);
          setHeaderTitle(subsubject_name);
          setShowSubjects(null); // Ẩn danh sách môn học sau khi chọn
          setExamEdited(null); // Reset trạng thái chỉnh sửa bài thi
        },
        "Tiếp tục",
        "Không"
      );
    } else {
      // Nếu không đang làm bài thi, trực tiếp chọn môn học và chuyển trang
      setSelectedSubject(subject_id);
      setSelectedContent(selected);
      setHeaderTitle(subsubject_name);
      setShowSubjects(null); // Ẩn danh sách môn học sau khi chọn
      setExamEdited(null); // Reset trạng thái chỉnh sửa bài thi
    }
  };

  // Toggle hiển thị danh sách môn học
  const toggleSubjects = () => {
    setShowSubjects(!showSubjects); // Đảo ngược trạng thái hiển thị danh sách môn học
  };

  // Toggle môn học (mở/đóng danh sách subsubjects)
  const toggleSubject = (subjectId) => {
    setActiveSubject(activeSubject === subjectId ? null : subjectId); // Chuyển đổi môn học đang mở/đóng
  };

  // Reset trang home
  const resetHome = () => {
    if (selectedContent === "doExam") {
      // Nếu đang làm bài thi, yêu cầu xác nhận trước khi quay lại trang chủ
      showConfirmDialog(
        "Bạn có muốn tiếp tục?",
        "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn, bạn vẫn muốn tiếp tục",
        "warning",
        () => {
          setSelectedContent(null);
          setSelectedSubject(null);
          setHeaderTitle(null);
          setExamEdited(null); // Reset toàn bộ trạng thái
        },
        "Tiếp tục",
        "Hủy"
      );
    } else {
      // Nếu không đang làm bài thi, quay lại trang chủ mà không yêu cầu xác nhận
      setSelectedContent(null);
      setSelectedSubject(null);
      setHeaderTitle(null);
      setExamEdited(null); // Reset toàn bộ trạng thái
    }
  };

  return (
    <aside className={cx("container")}>
      {/* Logo */}
      <div className={cx("logo")} onClick={resetHome}>
        <FontAwesomeIcon icon={faBook} /> <span>Edu Quiz</span>
      </div>

      {/* Danh sách bài thi */}
      <div className={cx("item", "list")} onClick={toggleSubjects}>
        <div>Danh sách bài thi</div>
        <motion.span {...rotateArrow(showSubjects)}>
          <FontAwesomeIcon icon={faCaretRight} />
        </motion.span>
      </div>
      {/* Danh sách môn học có hiệu ứng mở rộng */}
      <AnimatePresence initial={false}>
        {showSubjects && (
          <motion.div
            key="subjects-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {subjects.map((subject) => (
              <div key={subject.subject_id} className={cx("subject")}>
                <div
                  className={cx("item")}
                  onClick={() => toggleSubject(subject.subject_id)}
                >
                  {subject.name}
                  {subject.subsubjects.length !== 0 && (
                    <motion.span
                      {...rotateArrow(activeSubject === subject.subject_id)}
                    >
                      <FontAwesomeIcon
                        icon={faCaretRight}
                        className={cx("icon")}
                      />
                    </motion.span>
                  )}
                </div>

                {/* Subsubjects có hiệu ứng mở rộng */}
                <AnimatePresence initial={false}>
                  {activeSubject === subject.subject_id && (
                    <motion.div
                      className={cx("sub-items")}
                      {...expandCollapseMotion}
                    >
                      {subject.subsubjects.map((subsubject) => (
                        <motion.div
                          key={subsubject.subsubjects_id}
                          className={cx("sub-item")}
                          {...fadeSlideIn}
                          onClick={() =>
                            handleSelectdSubject(
                              "exam",
                              subsubject.subsubjects_id,
                              subsubject.subject_name
                            )
                          }
                        >
                          {subsubject.subject_name}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Các mục khác */}
      <div
        className={cx("item")}
        onClick={() => handleCheckLogin("info", "Thông tin cá nhân")}
      >
        Thông tin cá nhân
      </div>
      <div
        className={cx("item")}
        onClick={() => handleCheckLogin("history", "Lịch sử làm bài")}
      >
        Lịch sử làm bài
      </div>

      {/* Mục dành cho giáo viên */}
      {user && user.role === "teacher" && (
        <div
          className={cx("item")}
          onClick={() => handleCheckLogin("makeExam", "Tạo bài thi")}
        >
          Tạo bài thi
        </div>
      )}

      {user && user.role === "teacher" && (
        <div
          className={cx("item")}
          onClick={() => handleCheckLogin("listExam", "Danh sách bài thi")}
        >
          Danh sách bài thi đã tạo
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
