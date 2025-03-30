import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LoginPage.module.scss";

import classNames from "classnames/bind";
import {
  faBook,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { EMAILREGEX } from "../../Utils/const";

const cx = classNames.bind(styles);

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false); // State kiểm tra hợp lệ
  const timeoutRef = useRef(null);

  const handleChangePass = (e) => {
    const value = e.target.value;
    setPassword(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length < 8) {
        showErrorToast("Mật khẩu phải có ít nhất 8 ký tự!", 1200);
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }, 800);
  };

  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length === 0) {
        showErrorToast("Vui lòng nhập email!", 1200);
        setIsValid(false);
      } else if (!EMAILREGEX.test(value)) {
        showErrorToast(
          "Email không hợp lệ! Vui lòng nhập đúng định dạng.",
          1200
        );
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form submit mặc định
    if (!isValid) {
      showErrorToast("Vui lòng nhập thông tin hợp lệ!", 1500);
      return;
    }
    showSuccessToast("Đăng nhập thành công!", 1500); // Thay thế bằng logic xử lý form
  };

  return (
    <div className={cx("wrapper")}>
      <Link to={"/"} className={cx("home")}>
        <FontAwesomeIcon icon={faBook} /> Edu Quiz
      </Link>
      <div className={cx("container")}>
        <form onSubmit={handleSubmit}>
          <img src="/logoW.png" alt="Owl Logo" className={cx("logo")} />
          <h2>ĐĂNG NHẬP </h2>
          <div className={cx("input-group")}>
            <span className={cx("input-icon")}>
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              placeholder="Nhập email"
              setEmail={email}
              onChange={handleChangeEmail}
            />
          </div>
          <div className={cx("input-group")}>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={handleChangePass}
            />
            <span className={cx("input-icon")}>
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
          <div className={cx("login")}>
            <Button>Đăng nhập</Button>
          </div>
          <div className={cx("signup")}>
            <a href="/signup">Đăng ký</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
