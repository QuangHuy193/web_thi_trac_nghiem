//file của dự án
import styles from "./Header.module.scss";

//thư viện
import classNames from "classnames/bind";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import MenuMobile from "../MenuMobile/MenuMobile";

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

      {/* Menu chính destop*/}
      <div className={cx("menu", { "menu-show": showMenu })}>
        {data.map((subject, index) => (
          <Tippy
            key={index}
            content={
              <div className={cx("dropdown")}>
                {subject.item.map((item, idx) => (
                  <div key={idx} className={cx("dropdown-item")}>
                    {item}
                  </div>
                ))}
              </div>
            }
            interactive={true}
            placement="bottom"
          >
            <div className={cx("menu-item")}>{subject.subjects}</div>
          </Tippy>
        ))}
      </div>

      {showMenu && (
        <MenuMobile data={data} showMenu={showMenu} setShowMenu={setShowMenu} />
      )}
    </header>
  );
}

export default Header;
