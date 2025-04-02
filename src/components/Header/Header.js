//file của dự án
import styles from "./Header.module.scss";
import Button from "../Button/Button";
import MenuMobile from "../MenuMobile/MenuMobile";
// Thêm import này cùng với các import khác
import Search from "../Search/Search"; //thư viện

import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {  useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { showConfirmDialog } from "../confirmDialog/confirmDialog";

const cx = classNames.bind(styles);

function Header({
  setSelectedContent,
  headerTitle,
  setHeaderTitle,
  setSelectedSubject,
  selectedContent,
  user,
  setUser,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedContent === "doExam") {
      showConfirmDialog(
        "Bạn muốn tiếp tục?",
        "Bạn đang làm bài, đến trang đăng nhập sẽ hủy kết quả làm bài của bạn!",
        "warning",
        () => {
          navigate("/login");
        },
        "Tiếp tục",
        "Không"
      );
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    showConfirmDialog(
      "",
      "Bạn chắc chắn muốn đăng xuất?",
      "question",
      () => {
        if (selectedContent !== "doExam") {
          localStorage.removeItem("user");
          setHeaderTitle("");
          setSelectedContent("");
          setUser(JSON.parse(localStorage.getItem("user")));
          showSuccessToast("Đăng xuất thành công!", 1200);
        } else {
          showErrorToast("Bạn không thể đăng xuất khi đang làm bài!", 1200);
        }
      },
      "Chắc chắn",
      "Không"
    );
  };

  return (
    <header className={cx("container")}>
      <div className={cx("title")}>
        {headerTitle ? headerTitle : "Trang chủ"}
      </div>

      {/* tạm ẩn ở mobile */}
      {selectedContent === "exam" && (
        <div className={cx("search-wrapper")}>
          <Search />
        </div>
      )}

      {/* Icon menu chỉ hiển thị trên mobile */}
      <div className={cx("menu-toggle")} onClick={() => setShowMenu(!showMenu)}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {showMenu && (
        <MenuMobile
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          setSelectedContent={setSelectedContent}
          setSelectedSubject={setSelectedSubject}
          setHeaderTitle={setHeaderTitle}
          user={user}
        />
      )}

      {/* thêm xử lý mobile */}
      {user ? (
        <div className={cx("username")}>
          <FontAwesomeIcon className={cx("username-icon")} icon={faUser} />{" "}
          <span className={cx("username-name")}>{user.username}</span>
          <FontAwesomeIcon
            className={cx("logout")}
            icon={faRightFromBracket}
            onClick={handleLogout}
          />
        </div>
      ) : (
        <div className={cx("btn-login")} onClick={handleLogin}>
          <Button>Đăng nhập</Button>
        </div>
      )}
    </header>
  );
}

export default Header;
