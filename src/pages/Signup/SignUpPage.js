import React, { useRef, useState } from "react";
import styles from "./SignUp.module.scss"; // Import đúng SCSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faBook,
  faClose,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { EMAILREGEX } from "../../Utils/const";
import {
  handleChangePass,
  togglePasswordVisibility,
} from "../../Utils/function";

const cx = classNames.bind(styles);

const Signup = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const timeoutRef = useRef(null);
  const [isValid, setIsValid] = useState({
    name: true,
    password: true,
    confirmPassword: true,
    email: true,
  });
  const [isTouched, setIsTouched] = useState({
    email: false,
    password: false,
    name: false,
    confirmPassword: false,
  });
  const [confirmPass, setConfirmPass] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChangeEmail = (e) => {
    const value = e.target.value;

    setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const handleChangeName = (e) => {
    const value = e.target.value;

    setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setFormData({ ...formData, [e.target.name]: e.target.value });

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length === 0) {
        showErrorToast("Vui lòng nhập tên của bạn!", 1200);
        setIsValid({ ...isValid, name: false });
      } else {
        setIsValid({ ...isValid, name: true });
      }
    }, 800);
  };

  const handleChangePass2 = (e) => {
    const value = e.target.value;

    setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setConfirmPass(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value !== formData.password) {
        showErrorToast("Mật khẩu nhập lại không đúng!", 1200);
        setIsValid({ ...isValid, confirmPassword: false });
      } else {
        setIsValid({ ...isValid, confirmPassword: true });
      }
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = Object.values(isTouched).every((touched) => touched);
    const allValid = Object.values(isValid).every((valid) => valid);

    if (allTouched && allValid) {
      showSuccessToast("Đăng ký thành công!", 1500); // Thay thế bằng logic xử lý form
    } else {
      showErrorToast("Vui lòng nhập thông tin hợp lệ!", 1500);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <Link to={"/"} className={styles.homeLink}>
        <FontAwesomeIcon icon={faBook} /> Edu Quiz
      </Link>
      <div className={styles.signupBox}>
        <h2>ĐĂNG KÝ TÀI KHOẢN MỚI</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} /> Họ
              và Tên
            </label>
            <div className={cx("input-and-icon")}>
              <input
                type="text"
                name="name"
                placeholder="Họ và tên người dùng"
                value={formData.name}
                onChange={handleChangeName}
              />
              {isTouched.name && !isValid.name && (
                <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />{" "}
              Email
            </label>
            <div className={cx("input-and-icon")}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChangeEmail}
              />
              {isTouched.email && !isValid.email && (
                <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} /> Mật
              khẩu
            </label>
            <div className={cx("input-and-icon")}>
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
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
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              Nhập lại mật khẩu
            </label>
            <div className={cx("input-and-icon")}>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={confirmPass}
                onChange={handleChangePass2}
              />
              <FontAwesomeIcon
                className={cx("icon-eye")}
                icon={!showPassword.confirmPassword ? faEye : faEyeSlash}
                onClick={() =>
                  togglePasswordVisibility(setShowPassword, "confirmPassword")
                }
              />
              {isTouched.confirmPassword && !isValid.confirmPassword && (
                <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
              )}
            </div>
          </div>
          <button type="submit" className={styles.signupBtn}>
            Đăng Ký
          </button>
        </form>
        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
