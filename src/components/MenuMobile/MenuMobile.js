import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";//tạo hiệu ứng dropdown mượt hơn

import styles from "./MenuMobile.module.scss";
import { getAllSubjectsAPI } from "../../Api/api";
import { showErrorToast } from "../../Utils/ToastNotification";
import { expandCollapseMotion } from "../../Utils/motionConfigs";

const cx = classNames.bind(styles);

function MenuMobile({
  showMenu,
  setShowMenu,
  setSelectedContent,
  setHeaderTitle,
  setSelectedSubject,
  user,
}) {
  // Danh sách các subject đang mở (đang hiển thị subsubjects)
  const [openSubjects, setOpenSubjects] = useState([]);

  // Danh sách tất cả các môn học từ API
  const [subjects, setSubjects] = useState([]);

  // Trạng thái hiển thị toàn bộ danh sách môn học
  const [showSubjects, setShowSubjects] = useState(false);

  // Lấy danh sách môn học khi component được render lần đầu
  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getAllSubjectsAPI();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  // Xử lý khi chọn một môn học con (subsubject)
  const handleSelectdSubject = (selected, subject_id, subsubject_name) => {
    setSelectedSubject(subject_id);
    setSelectedContent(selected);
    setHeaderTitle(subsubject_name);
    setShowMenu(false); // đóng menu sau khi chọn
  };

  // Toggle hiển thị danh sách môn học chính
  const toggleSubjectsList = () => {
    setShowSubjects((prev) => !prev);
  };

  // Toggle hiển thị môn học con (subsubjects) của một môn học cụ thể
  const toggleSubject = (subjectId) => {
    setOpenSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  // Kiểm tra đăng nhập trước khi chuyển trang (ví dụ: thông tin cá nhân)
  const handleCheckLogin = (selected, titlePage) => {
    if (user) {
      handleSetSelectedContent(selected, titlePage);
    } else {
      showErrorToast("Bạn cần đăng nhập để thực hiện chức năng này!");
    }
  };

  // Cập nhật nội dung đang được chọn, tiêu đề trang và đóng menu
  const handleSetSelectedContent = (selected, titlePage) => {
    setSelectedContent(selected);
    setHeaderTitle(titlePage);
    setShowMenu(false);
  };

  return (
    <div className={cx("menu-container", { show: showMenu })}>
      {/* Overlay menu bên ngoài */}
      <div className={cx("menu-overlay")}>
        <div className={cx("menu-content")}>
          {/* Nút đóng menu */}
          <div className={cx("menu-close")} onClick={() => setShowMenu(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </div>

          {/* Tiêu đề menu */}
          <h2 className={cx("menu-title")}>
            <FontAwesomeIcon icon={faBook} /> <span>Edu Quiz</span>
          </h2>

          {/* Toggle hiển thị danh sách môn học */}
          <div className={cx("menu-subject")} onClick={toggleSubjectsList}>
            <div>Danh sách môn thi</div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={cx("icon", { rotated: showSubjects })}
            />
          </div>

          {/* Danh sách môn học chính và phụ (nếu có) */}
          <AnimatePresence>
            {showSubjects && (
              <motion.ul
                className={cx("menu-list")}
                {...expandCollapseMotion}
              >
                {subjects.map((subject) => (
                  <li key={subject.subject_id} className={cx("menu-item")}>
                    <div
                      className={cx("subject")}
                      onClick={() => toggleSubject(subject.subject_id)}
                    >
                      <strong>{subject.name}</strong>
                      {subject.subsubjects.length !== 0 && (
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={cx("icon", {
                            rotated: openSubjects.includes(subject.subject_id),
                          })}
                        />
                      )}
                    </div>

                    {/* Subsubjects (dropdown con) */}
                    <AnimatePresence>
                      {openSubjects.includes(subject.subject_id) &&
                        subject.subsubjects.length > 0 && (
                          <motion.ul
                            className={cx("submenu")}
                            {...expandCollapseMotion}
                          >
                            {subject.subsubjects.map((sub) => (
                              <li
                                key={sub.subsubjects_id}
                                onClick={() => {
                                  handleSelectdSubject(
                                    "exam",
                                    sub.subsubjects_id,
                                    sub.subject_name
                                  );
                                }}                            
                              >
                                {sub.subject_name}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                    </AnimatePresence>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Đăng nhập nếu chưa login */}
          {!user && (
            <Link to={"/login"}>
              <div className={cx("menu-item-parent")}>Đăng nhập</div>
            </Link>
          )}

          {/* Các mục chức năng cần login */}
          <div
            className={cx("menu-item-parent")}
            onClick={() => handleCheckLogin("info", "Thông tin cá nhân")}
          >
            Thông tin cá nhân
          </div>
          <div
            className={cx("menu-item-parent")}
            onClick={() => handleCheckLogin("history", "Lịch sử làm bài")}
          >
            Lịch sử làm bài
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuMobile;
