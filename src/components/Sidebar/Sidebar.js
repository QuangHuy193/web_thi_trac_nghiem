import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCaretDown,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { showErrorToast } from "../../Utils/ToastNotification";
import { getAllSubjectsAPI } from "../../Api/api";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";

const cx = classNames.bind(styles);

function Sidebar({
  selectedContent,
  setSelectedContent,
  setSelectedSubject,
  setHeaderTitle,
  user,
}) {
  const [showSubjects, setShowSubjects] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getAllSubjectsAPI();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  //kiểm tra đã đăng nhập chưa
  const handleCheckLogin = (selected, titlePage) => {
    if (user) {
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
        handleSetSelectedContent(selected, titlePage);
      }
    } else {
      showErrorToast("Bận cần đăng nhập để thực hiện chức năng này!", 1500);
    }
  };

  // set menu dc chọn
  const handleSetSelectedContent = (selected, titlePage) => {
    setSelectedContent(selected);
    setHeaderTitle(titlePage);
  };

  //set môn dc chọn
  const handleSelectdSubject = (selected, subject_id, subsubject_name) => {
    if (selectedContent === "doExam") {
      showConfirmDialog(
        "Bạn có muốn tiếp tục?",
        "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn, bạn vẫn muốn tiếp tục",
        "warning",
        () => {
          setSelectedSubject(subject_id);
          setSelectedContent(selected);
          setHeaderTitle(subsubject_name);
          setShowSubjects(null);
        },
        "Tiếp tục",
        "Không"
      );
    } else {
      setSelectedSubject(subject_id);
      setSelectedContent(selected);
      setHeaderTitle(subsubject_name);
      setShowSubjects(null);
    }
  };

  // Toggle danh sách môn thi
  const toggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  // Toggle môn học
  const toggleSubject = (subjectId) => {
    setActiveSubject(activeSubject === subjectId ? null : subjectId);
  };

  //reser trang home
  const resetHome = () => {
    if (selectedContent === "doExam") {
      showConfirmDialog(
        "Bạn có muốn tiếp tục?",
        "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn, bạn vẫn muốn tiếp tục",
        "warning",
        () => {
          setSelectedContent(null);
          setSelectedSubject(null);
          setHeaderTitle(null);
        },
        "Tiếp tục",
        "Hủy"
      );
    } else {
      setSelectedContent(null);
      setSelectedSubject(null);
      setHeaderTitle(null);
    }
  };

  return (
    <aside className={cx("container")}>
      <div className={cx("logo")} onClick={resetHome}>
        <FontAwesomeIcon icon={faBook} /> <span>Edu Quiz</span>
      </div>

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
      {user && user.role === "teacher" && (
        <div className={cx("item")} onClick={() => setSelectedContent("makeExam")}>
          Tạo bài thi
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
