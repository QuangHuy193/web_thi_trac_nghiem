//file của dự án
import styles from "./Header.module.scss";
import Button from "../Button/Button";
import MenuMobile from "../MenuMobile/MenuMobile";
// Thêm import này cùng với các import khác
import Search from "../Search/Search";//thư viện

import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";

const cx = classNames.bind(styles);

function Header({
  setSelectedContent,
  headerTitle,
  setHeaderTitle,
  setSelectedSubject,
  selectedContent,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <header className={cx("container")}>
      <div className={cx("title")}>
        {headerTitle ? headerTitle : "Trang chủ"}
      </div>
     
     {/* tạm ẩn ở mobile */}
      <div className={cx("search-wrapper")}>
        <Search />
      </div>
      
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
        />
      )}
      {/* thêm xử lý mobile */}
      {user ? (
        <div className={cx("username")}>
          <FontAwesomeIcon icon={faUser} /> <span>{user.username}</span>
          <FontAwesomeIcon
            className={cx("logout")}
            icon={faRightFromBracket}
            onClick={() => {
              if (selectedContent !== "doExam") {
                localStorage.removeItem("user");
                setHeaderTitle("");
                setSelectedContent("");
                setUser(JSON.parse(localStorage.getItem("user")));
                showSuccessToast("Đăng xuất thành công!", 1200);
              } else {
                showErrorToast(
                  "Bạn không thể đăng xuất khi đang làm bài!",
                  1200
                );
              }
            }}
          />
        </div>
      ) : (
        <Link className={cx("btn-login")} to={"/login"}>
          <Button>Đăng nhập</Button>
        </Link>
      )}
    </header>
  );
}

export default Header;
