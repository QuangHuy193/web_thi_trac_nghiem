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
import { Link, useNavigate } from "react-router-dom";
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
import { registerAPI } from "../../Api/api";

const cx = classNames.bind(styles);

const Signup = () => {
  //chuyển trang
  const navigative = useNavigate();

  // State quản lý trạng thái hiển thị mật khẩu (show/hide password)
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // useRef lưu trữ tham chiếu đến timeout để xử lý debounce khi kiểm tra các trường nhập
  const timeoutRef = useRef(null);

  // State kiểm tra tính hợp lệ của các trường (name, email, password, confirmPassword)
  const [isValid, setIsValid] = useState({
    name: true,
    password: true,
    confirmPassword: true,
    email: true,
  });

  // State kiểm tra trạng thái người dùng đã thay đổi các trường (name, email, password, confirmPassword)
  const [isTouched, setIsTouched] = useState({
    email: false,
    password: false,
    name: false,
    confirmPassword: false,
  });

  // State lưu trữ confirm password
  const [confirmPass, setConfirmPass] = useState("");

  // State lưu trữ thông tin form (name, email, password)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Hàm xử lý thay đổi email, kiểm tra hợp lệ sau một khoảng thời gian (debounce)
  const handleChangeEmail = (e) => {
    const value = e.target.value;

    // Đánh dấu email đã được chỉnh sửa
    setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Xóa timeout cũ và thiết lập timeout mới để kiểm tra email sau 800ms
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // Kiểm tra điều kiện hợp lệ của email
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
    }, 1500); // Thực hiện sau để giảm số lần kiểm tra khi người dùng nhập email
  };

  // Hàm xử lý thay đổi tên người dùng, kiểm tra hợp lệ sau một khoảng thời gian (debounce)
  const handleChangeName = (e) => {
    const value = e.target.value;

    // Đánh dấu tên đã được chỉnh sửa
    setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Xóa timeout cũ và thiết lập timeout mới để kiểm tra tên sau 800ms
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

  // Hàm xử lý thay đổi confirm password, kiểm tra nếu mật khẩu nhập lại trùng khớp
  const handleChangePass2 = (e) => {
    const value = e.target.value;

    // Đánh dấu confirm password đã được chỉnh sửa
    setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setConfirmPass(value);

    // Xóa timeout cũ và thiết lập timeout mới để kiểm tra confirm password sau 800ms
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

  // Hàm xử lý khi submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem tất cả các trường đã được thay đổi và hợp lệ chưa
    const allTouched = Object.values(isTouched).every((touched) => touched);
    const allValid = Object.values(isValid).every((valid) => valid);

    if (allTouched && allValid) {
      try {
        // Gọi API đăng ký
        const result = await registerAPI(
          formData.name,
          formData.email,
          formData.password,
          "student"
        );

        // Kiểm tra kết quả đăng ký
        if (result.user) {
          navigative("/login"); // Điều hướng về trang đăng nhập
          showSuccessToast(result.message || "Đăng ký thành công!", 1200);
        } else {
          showErrorToast(result.message || "Đăng ký thất bại!", 1200);
        }
      } catch (error) {
        showErrorToast("Có lỗi xảy ra, vui lòng thử lại!", 1200);
      }
    } else {
      showErrorToast("Vui lòng nhập thông tin hợp lệ!", 1200);
    }
  };

  return (
    <div className={styles.signupContainer}>
      {/* Link về trang chủ */}
      <Link to={"/"} className={styles.homeLink}>
        <FontAwesomeIcon icon={faBook} /> Edu Quiz
      </Link>
      <div className={styles.signupBox}>
        {/* Tiêu đề form */}
        <h2>ĐĂNG KÝ TÀI KHOẢN MỚI</h2>
        <form onSubmit={handleSubmit}>
          {/* Nhập tên người dùng */}
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
                onChange={handleChangeName} // Gọi hàm kiểm tra tên người dùng
              />
              {isTouched.name && !isValid.name && (
                <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
              )}
            </div>
          </div>

          {/* Nhập email */}
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
                onChange={handleChangeEmail} // Gọi hàm kiểm tra email
              />
              {isTouched.email && !isValid.email && (
                <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
              )}
            </div>
          </div>

          {/* Nhập mật khẩu */}
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

          {/* Nhập lại mật khẩu */}
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
                onChange={handleChangePass2} // Gọi hàm kiểm tra confirm password
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

          {/* Nút đăng ký */}
          <button type="submit" className={styles.signupBtn}>
            Đăng Ký
          </button>
        </form>
        {/* Liên kết đăng nhập */}
        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
