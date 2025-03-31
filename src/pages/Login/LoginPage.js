import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LoginPage.module.scss";

import classNames from "classnames/bind";
import {
  faBook,
  faClose,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import {
  handleChangePass,
  togglePasswordVisibility,
} from "../../Utils/function";
import { EMAILREGEX } from "../../Utils/const";

const cx = classNames.bind(styles);

function Login() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isValid, setIsValid] = useState({
    email: true,
    password: true,
  }); // State kiểm tra hợp lệ
  const [isTouched, setIsTouched] = useState({ email: false, password: false }); // Thêm trạng thái này

  const timeoutRef = useRef(null);

  const handleChangeEmail = (e) => {
    const value = e.target.value;

    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsTouched((prev) => ({ ...prev, email: true }));

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length === 0) {
        showErrorToast("Vui lòng nhập email!", 1200);
        setIsValid({ ...isValid, email: false });
      } else if (!EMAILREGEX.test(value)) {
        showErrorToast(
          "Email không hợp lệ! Vui lòng nhập đúng định dạng.",
          1200
        );
        setIsValid({ ...isValid, email: false });
      } else {
        setIsValid({ ...isValid, email: true });
      }
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form submit mặc định
    if (
      isTouched.email &&
      isTouched.password &&
      isValid.password &&
      isValid.email
    ) {
      showSuccessToast("Đăng nhập thành công!", 1500); // Thay thế bằng logic xử lý form
    } else {
      showErrorToast("Vui lòng nhập thông tin hợp lệ!", 1500);
    }
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
              type="text"
              name="email"
              placeholder="Nhập email"
              setEmail={formData.email}
              onChange={handleChangeEmail}
            />
            {isTouched.email && !isValid.email && (
              <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
            )}
          </div>
          <div className={cx("input-group")}>
            <span className={cx("input-icon")}>
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={(e) =>
                handleChangePass(
                  e,
                  setFormData,
                  setIsValid,
                  setIsTouched,
                  timeoutRef
                )
              }
            />
            <FontAwesomeIcon
              className={cx("icon-eye")}
              icon={!showPassword.password ? faEye : faEyeSlash}
              onClick={() =>
                togglePasswordVisibility(setShowPassword, "password")
              }
            />
            {isTouched.password && !isValid.password && (
              <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
            )}
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
