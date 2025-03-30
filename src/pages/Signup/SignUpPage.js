import React, { useRef, useState } from "react";
import styles from "./SignUp.module.scss"; // Import đúng SCSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faBook,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { EMAILREGEX } from "../../Utils/const";

const cx = classNames.bind(styles);

const Signup = () => {
  const timeoutRef = useRef(null);
  const [isValid, setIsValid] = useState({
    valid: false,
    name: true,
    password: true,
    comfirmPassword: true,
    email: true,
  }); // State kiểm tra hợp lệ
  const [comfirmPass, setComfirmPass] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        setIsValid({ ...isValid, valid: false, email: false });
      } else {
        setIsValid({ ...isValid, valid: true, email: true });
      }
    }, 800);
  };

  const handleChangeName = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length === 0) {
        showErrorToast("Vui lòng nhập tên của bạn!", 1200);
        setIsValid({ ...isValid, valid: false, name: false });
      } else {
        setIsValid({ ...isValid, valid: true, name: true });
      }
    }, 800);
  };

  const handleChangePass = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length < 8) {
        showErrorToast("Mật khẩu phải có ít nhất 8 ký tự!", 1200);
        setIsValid({ ...isValid, valid: false, password: false });
      } else {
        setIsValid({ ...isValid, valid: true, password: true });
      }
    }, 800);
  };

  const handleChangePass2 = (e) => {
    const value = e.target.value;
    setComfirmPass(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value !== formData.password) {
        showErrorToast("Mật khẩu nhập lại không đúng!", 1200);
        setIsValid({ ...isValid, valid: false, comfirmPassword: false });
      } else {
        setIsValid({ ...isValid, valid: true, comfirmPassword: true });
      }
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid.valid) {
      showErrorToast("Vui lòng nhập thông tin hợp lệ!", 1500);
      return;
    }
    showSuccessToast("Đăng ký thành công!", 1500); // Thay thế bằng logic xử lý form
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
              {!isValid.name && (
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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChangeEmail}
              />
              {!isValid.email && (
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
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChangePass}
              />
              {!isValid.password && (
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
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={comfirmPass}
                onChange={handleChangePass2}
              />
              {!isValid.comfirmPassword && (
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
