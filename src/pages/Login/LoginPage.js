import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LoginPage.module.scss";

import classNames from "classnames/bind";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";

const cx = classNames.bind(styles);

function Login() {
  return (
    <div className={cx("wrapper")}>
    <div className={cx("container")}>
      <form>
        <h2>ĐĂNG NHẬP </h2>
        <div className={cx("input-group")}>
        <span className={cx("input-icon")}>
            <FontAwesomeIcon icon={faEnvelope} />
          </span><input type="text" placeholder="Nhập email" />
      
        </div>
        <div className={cx("input-group")}>
          <input type="password" placeholder="Nhập mật khẩu" />
          <span className={cx("input-icon")}>
            <FontAwesomeIcon icon={faLock} />
          </span>
        </div>
        <div className={cx("login")}>
          <Button>Đăng nhập</Button>
        </div>
        <div className={cx("signup")}><a href="/signup">Đăng ký</a></div>
      </form>
    </div>
    </div>
  );
}

export default Login;
