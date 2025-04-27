import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { showErrorToast } from "../../Utils/ToastNotification";
import { getAllSubjectsAPI } from "../../apis";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";
import {
  expandCollapseMotion,
  rotateArrow,
  fadeSlideIn,
} from "../../configs/motionConfigs";

const cx = classNames.bind(styles);

function Sidebar({
  selectedContent,
  setSelectedContent,
  setSelectedSubject,
  setHeaderTitle,
  user,
  setExamEdited,
  setSelectedSubjectName,
}) {
  const [showSubjects, setShowSubjects] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [showTeacherMenu, setShowTeacherMenu] = useState(false); // State cho dropdown giáo viên

  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getAllSubjectsAPI();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const handleCheckLogin = (selected, titlePage) => {   
    if (user) {
      if (selectedContent === "doExam") {
        showConfirmDialog(
          "Bạn có muốn tiếp tục?",
          "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn",
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

  const handleSetSelectedContent = (selected, titlePage) => {
    setHeaderTitle(titlePage);
    setSelectedContent(selected);
    setExamEdited(null);
  };

  const handleSelectdSubject = (selected, subject_id, subsubject_name) => {
    if (selectedContent === "doExam") {
      showConfirmDialog(
        "Bạn có muốn tiếp tục?",
        "Bạn đang làm bài, hành động này sẽ hủy kết quả làm bài của bạn, bạn vẫn muốn tiếp tục",
        "warning",
        () => {
          setSelectedSubject(subject_id);
          setSelectedSubjectName(subsubject_name);
          setSelectedContent(selected);
          setHeaderTitle(subsubject_name);
          setShowSubjects(null);
          setExamEdited(null);
        },
        "Tiếp tục",
        "Không"
      );
    } else {
      setSelectedSubject(subject_id);
      setSelectedSubjectName(subsubject_name);
      setSelectedContent(selected);
      setHeaderTitle(subsubject_name);
      setShowSubjects(null);
      setExamEdited(null);
    }
  };

  const toggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  const toggleTeacherMenu = () => {
    setShowTeacherMenu(!showTeacherMenu); // Toggle menu giáo viên
  };

  return (
    <aside className={cx("container")}>
      <div
        className={cx("logo")}
        onClick={() => handleSetSelectedContent(null, null)}
      >
        <FontAwesomeIcon icon={faBook} /> <span>Edu Quiz</span>
      </div>

      <div className={cx("item", "list")} onClick={toggleSubjects}>
        <div>Danh sách bài thi</div>
        <motion.span {...rotateArrow(showSubjects)}>
          <FontAwesomeIcon icon={faCaretRight} />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {showSubjects && (
          <motion.div {...expandCollapseMotion}>
            {subjects.map((subject) => (
              <div key={subject.subject_id} className={cx("subject")}>
                <div
                  className={cx("item")}
                  onClick={() =>
                    setActiveSubject(
                      activeSubject === subject.subject_id
                        ? null
                        : subject.subject_id
                    )
                  }
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
        <div className={cx("item")} onClick={toggleTeacherMenu}>
          Các chức năng giáo viên
          <motion.span {...rotateArrow(showTeacherMenu)}>
            <FontAwesomeIcon icon={faCaretRight} />
          </motion.span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {showTeacherMenu && user && user.role === "teacher" && (
          <motion.div {...expandCollapseMotion}>
            <div
              className={cx("item", "subject")}
              onClick={() => handleCheckLogin("makeQuestion", "Tạo câu hỏi")}
            >
              Tạo câu hỏi
            </div>
            <div
              className={cx("item", "subject")}
              onClick={() =>
                handleCheckLogin("listQuestion", "Danh sách câu hỏi")
              }
            >
              Danh sách câu hỏi đã tạo
            </div>
            <div
              className={cx("item", "subject")}
              onClick={() => handleCheckLogin("makeExam", "Tạo bài thi")}
            >
              Tạo bài thi
            </div>
            <div
              className={cx("item", "subject")}
              onClick={() => handleCheckLogin("listExam", "Danh sách bài thi")}
            >
              Danh sách bài thi đã tạo
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

export default Sidebar;
