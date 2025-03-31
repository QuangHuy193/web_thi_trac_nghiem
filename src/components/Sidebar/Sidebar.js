import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCaretDown,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { checkLogin } from "../../Utils/function";
import { showErrorToast } from "../../Utils/ToastNotification";
import { getAllSubjects } from "../../Api/api";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Sidebar({ setSelectedContent, setSelectedSubject, setHeaderTitle }) {
  const [showSubjects, setShowSubjects] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getAllSubjects();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  //kiểm tra đã đăng nhập chưa
  const handleCheckLogin = (selected, titlePage) => {
    if (checkLogin()) {
      handleSetSelectedContent(selected);
      setHeaderTitle(titlePage);
    } else {
      showErrorToast("Bận cần đăng nhập để thực hiện chức năng này!", 1500);
    }
  };

  // set menu dc chọn
  const handleSetSelectedContent = (selected) => {
    setSelectedContent(selected);
  };

  //set môn dc chọn
  const handleSelectdSubject = (selected, subject_id, subsubject_name) => {
    setSelectedSubject(subject_id);
    setSelectedContent(selected);
    setHeaderTitle(subsubject_name);
    setShowSubjects(null);
  };

  // Toggle danh sách môn thi
  const toggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  // Toggle môn học
  const toggleSubject = (subjectId) => {
    setActiveSubject(activeSubject === subjectId ? null : subjectId);
  };

  return (
    <aside className={cx("container")}>
      <Link to={"/"}>
        <div className={cx("logo")}>
          <FontAwesomeIcon icon={faBook} /> <span>Edu Quiz</span>
        </div>
      </Link>

      <div className={cx("item", "list")} onClick={toggleSubjects}>
        <div>Danh sách bài thi</div>
        <span>
          <FontAwesomeIcon icon={showSubjects ? faCaretDown : faCaretRight} />
        </span>
      </div>
      {showSubjects &&
        subjects.map((subject) => (
          <div key={subject.subject_id} className={cx("subject")}>
            <div
              className={cx("item")}
              onClick={() => toggleSubject(subject.subject_id)}
            >
              {subject.name}
              {subject.subsubjects.length !== 0 && (
                <FontAwesomeIcon
                  icon={
                    activeSubject === subject.subject_id
                      ? faCaretDown
                      : faCaretRight
                  }
                  className={cx("icon")}
                />
              )}
            </div>

            {activeSubject === subject.subject_id && (
              <div className={cx("sub-items")}>
                {subject.subsubjects.map((subsubject) => (
                  <div
                    key={subsubject.subsubjects_id}
                    className={cx("sub-item")}
                    onClick={() =>
                      handleSelectdSubject(
                        "exam",
                        subsubject.subsubjects_id,
                        subsubject.subject_name
                      )
                    }
                  >
                    {subsubject.subject_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
    </aside>
  );
}

export default Sidebar;
