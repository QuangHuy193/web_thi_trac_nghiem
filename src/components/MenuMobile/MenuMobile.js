import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./MenuMobile.module.scss";
import { useEffect, useState } from "react";
import { getAllSubjectsAPI } from "../../Api/api";
import { checkLogin } from "../../Utils/function";
import { showErrorToast } from "../../Utils/ToastNotification";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function MenuMobile({
  showMenu,
  setShowMenu,
  setSelectedContent,
  setHeaderTitle,
  setSelectedSubject,
  user,
}) {
  const [openSubjects, setOpenSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getAllSubjectsAPI();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const handleSelectdSubject = (selected, subject_id, subsubject_name) => {
    setSelectedSubject(subject_id);
    setSelectedContent(selected);
    setHeaderTitle(subsubject_name);
    setShowMenu(false);
  };

  // Toggle hiển thị danh sách môn học
  const toggleSubjectsList = () => {
    setShowSubjects((prev) => !prev);
  };

  // Xử lý toggle môn học
  const toggleSubject = (subjectId) => {
    setOpenSubjects(
      (prev) =>
        prev.includes(subjectId)
          ? prev.filter((id) => id !== subjectId) // Ẩn nếu đang mở
          : [...prev, subjectId] // Hiện nếu đang ẩn
    );
  };

  const handleCheckLogin = (selected, titlePage) => {
    if (user) {
      handleSetSelectedContent(selected,titlePage);
    } else {
      showErrorToast("Bận cần đăng nhập để thực hiện chức năng này!");
    }
  };

  const handleSetSelectedContent = (selected, titlePage) => {
    setSelectedContent(selected);
    setHeaderTitle(titlePage);
    setShowMenu(false);
  };

  return (
    <div className={cx("menu-container", { show: showMenu })}>
      {/* Overlay Menu */}
      <div className={cx("menu-overlay")}>
        <div className={cx("menu-content")}>
          {/* Icon đóng menu */}
          <div className={cx("menu-close")} onClick={() => setShowMenu(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </div>

          {/* Tiêu đề */}
          <h2 className={cx("menu-title")}>
            <FontAwesomeIcon icon={faBook} /> <span>Edu Quiz</span>
          </h2>

          <div className={cx("menu-subject")} onClick={toggleSubjectsList}>
            <div>Danh sách môn thi</div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={cx("icon", { rotated: showSubjects })}
            />
          </div>
          {/* Danh sách môn học */}
          {showSubjects && (
            <ul className={cx("menu-list")}>
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
                  {openSubjects.includes(subject.subject_id) &&
                    subject.subsubjects.length > 0 && (
                      <ul className={cx("submenu")}>
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
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          )}

          {!user && (
            <Link to={"/login"}>
              <div className={cx("menu-item-parent")}>Đăng nhập</div>
            </Link>
          )}

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
