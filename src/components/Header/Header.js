//file của dự án
import styles from "./Header.module.scss";
import Button from "../Button/Button";
import MenuMobile from "../MenuMobile/MenuMobile";

//thư viện
import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Header({
  setSelectedContent,
  headerTitle,
  setHeaderTitle,
  setSelectedSubject,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={cx("container")}>
      <div className={cx("title")}>
        {headerTitle ? headerTitle : "Trang chủ"}
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

      <Link className={cx("btn-login")} to={"/login"}>
        <Button>Đăng nhập</Button>
      </Link>
    </header>
  );
}

export default Header;
