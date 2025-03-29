//file của dự án
import styles from "./Header.module.scss";

//thư viện
import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Header({ data }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={cx("container")}>
      <div className={cx("home")}>Trang chủ</div>

      {/* Icon menu chỉ hiển thị trên mobile */}
      <div className={cx("menu-toggle")} onClick={() => setShowMenu(!showMenu)}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      <Link className={cx("btn-login")} to={"/login"}>
        <Button>Đăng nhập</Button>
      </Link>
    </header>
  );
}

export default Header;
