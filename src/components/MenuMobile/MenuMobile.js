import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./MenuMobile.module.scss";
import { useState } from "react";

const cx = classNames.bind(styles);

function MenuMobile({ data, showMenu, setShowMenu }) {
  const [openSubjects, setOpenSubjects] = useState([]);

  // Xử lý toggle môn học
  const toggleSubject = (subject) => {
    setOpenSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((item) => item !== subject) // Ẩn nếu đang mở
        : [...prev, subject] // Hiện nếu đang ẩn
    );
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
          <h2 className={cx("menu-title")}>Danh sách môn học</h2>

          {/* Danh sách môn học */}
          <ul className={cx("menu-list")}>
            {data.map((subject, index) => (
              <li key={index} className={cx("menu-item")}>
                <div className={cx("subject")} onClick={() => toggleSubject(subject.subjects)}>
                  <strong>{subject.subjects}</strong>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cx("icon", { rotated: openSubjects.includes(subject.subjects) })}
                  />
                </div>
                {openSubjects.includes(subject.subjects) && (
                  <ul className={cx("submenu")}>
                    {subject.item.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Nút liên hệ */}
          <div className={cx("contact-link")}>
            <a href="#">Liên hệ</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuMobile;
