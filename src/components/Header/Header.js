import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {  useNavigate } from "react-router-dom";

import styles from "./Header.module.scss";
import Button from "../Button/Button";
import MenuMobile from "../MenuMobile/MenuMobile";
import Search from "../Search/Search"; 
import classNames from "classnames/bind";
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
  // Trạng thái hiển thị menu mobile
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  // Xử lý khi nhấn nút "Đăng nhập"
  const handleClickLogin = () => {
    if (selectedContent === "doExam") {
      // Nếu đang làm bài thì cảnh báo sẽ mất kết quả
      showConfirmDialog(
        "Bạn muốn tiếp tục?",
        "Bạn đang làm bài, đến trang đăng nhập sẽ hủy kết quả làm bài của bạn!",
        "warning",
        () => {
          navigate("/login"); // Chuyển hướng đến trang đăng nhập
        },
        "Tiếp tục",
        "Không"
      );
    } else {
      navigate("/login"); // Chuyển đến trang đăng nhập bình thường
    }
  };

  // Xử lý khi nhấn "Đăng xuất"
  const handleClickLogout = () => {
    showConfirmDialog(
      "",
      "Bạn chắc chắn muốn đăng xuất?",
      "question",
      () => {
        if (selectedContent !== "doExam") {
          // Nếu không đang làm bài thì cho phép đăng xuất
          localStorage.removeItem("user"); // Xóa user khỏi localStorage
          setHeaderTitle(""); // Reset tiêu đề
          setSelectedContent(""); // Quay về giao diện chính
          setUser(JSON.parse(localStorage.getItem("user"))); // Reset user
          showSuccessToast("Đăng xuất thành công!", 1200);
        } else {
          // Không cho đăng xuất khi đang làm bài
          showErrorToast("Bạn không thể đăng xuất khi đang làm bài!", 1200);
        }
      },
      "Chắc chắn",
      "Không"
    );
  };

  return (
    <header className={cx("container")}>
      {/* Hiển thị tiêu đề: nếu không có thì hiện "Trang chủ" */}
      <div className={cx("title")}>
        {headerTitle ? headerTitle : "Trang chủ"}
      </div>

      {/* Ô tìm kiếm (chỉ hiện khi đang ở giao diện chọn đề thi) */}
      {selectedContent === "exam" && (
        <div className={cx("search-wrapper")}>
          <Search />
        </div>
      )}

      {/* Icon menu dành cho mobile */}
      <div className={cx("menu-toggle")} onClick={() => setShowMenu(!showMenu)}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Menu mobile khi được bật */}
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

      {/* Giao diện hiển thị tài khoản hoặc nút đăng nhập */}
      {user ? (
        <div className={cx("username")}>
          {/* Tên người dùng */}
          <FontAwesomeIcon className={cx("username-icon")} icon={faUser} />{" "}
          <span className={cx("username-name")}>{user.username}</span>

          {/* Nút đăng xuất */}
          <FontAwesomeIcon
            className={cx("logout")}
            icon={faRightFromBracket}
            onClick={handleClickLogout}
          />
        </div>
      ) : (
        // Nút đăng nhập nếu chưa có user
        <div className={cx("btn-login")} onClick={handleClickLogin}>
          <Button>Đăng nhập</Button>
        </div>
      )}
    </header>
  );
}

export default Header;
