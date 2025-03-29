import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { checkLogin } from "../../Utils/function";
import { showErrorToast } from "../../Utils/ToastNotification";

const cx = classNames.bind(styles);

function Sidebar({ data, setSelectedContent }) {
  const [showSubjects, setShowSubjects] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);

  const handleCheckLogin = (selected) => {
    if (checkLogin()) {
      handleSetSelectedContent(selected);
    } else {
      showErrorToast("Bận cần đăng nhập để thực hiện chức năng này!");
    }
  };

  const handleSetSelectedContent = (selected) => {
    setSelectedContent(selected);
  };

  // Toggle danh sách môn thi
  const toggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  // Toggle môn học
  const toggleSubject = (subject) => {
    setActiveSubject(activeSubject === subject ? null : subject);
  };

  return (
    <aside className={cx("container")}>
      <div className={cx("item", "list")} onClick={toggleSubjects}>
        <div>Danh sách bài thi</div>
        <span>
          <FontAwesomeIcon icon={showSubjects ? faCaretDown : faCaretRight} />
        </span>
      </div>
      {showSubjects &&
        data.map((subject) => (
          <div key={subject.subjects} className={cx("subject")}>
            <div
              className={cx("item")}
              onClick={() => toggleSubject(subject.subjects)}
            >
              {subject.subjects}
              <FontAwesomeIcon
                icon={
                  activeSubject === subject.subjects
                    ? faCaretDown
                    : faCaretRight
                }
                className={cx("icon")}
              />
            </div>

            {activeSubject === subject.subjects && (
              <div className={cx("sub-items")}>
                {subject.item.map((subItem) => (
                  <div key={subItem} className={cx("sub-item")}>
                    {subItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      <div className={cx("item")} onClick={() => handleCheckLogin("info")}>
        Thông tin cá nhân
      </div>
      <div className={cx("item")} onClick={() => handleCheckLogin("history")}>
        Lịch sử làm bài
      </div>
    </aside>
  );
}

export default Sidebar;
