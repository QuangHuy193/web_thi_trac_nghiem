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
import { Link, useNavigate } from "react-router-dom";
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
import { loginAPI } from "../../Api/api";

const cx = classNames.bind(styles);

function Login() {
  // dùng để chuyển trang
  const navigative = useNavigate()
  
  // State lưu trữ thông tin về việc hiển thị mật khẩu (show/hide password)
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // State lưu trữ dữ liệu form (email và mật khẩu)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State kiểm tra tính hợp lệ của email và mật khẩu
  const [isValid, setIsValid] = useState({
    email: true,
    password: true,
  });

  // State kiểm tra trạng thái người dùng đã thay đổi các trường (email, password)
  const [isTouched, setIsTouched] = useState({ email: false, password: false });

  // useRef lưu trữ tham chiếu đến timeout (để xử lý việc debounce khi kiểm tra email)
  const timeoutRef = useRef(null);

  // Hàm xử lý thay đổi email, kiểm tra hợp lệ sau một khoảng thời gian (debounce)
  const handleChangeEmail = (e) => {
    const value = e.target.value;

    // Cập nhật giá trị email trong form
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Đánh dấu email đã được chỉnh sửa
    setIsTouched((prev) => ({ ...prev, email: true }));

    // Xóa timeout cũ và thiết lập timeout mới để kiểm tra email sau 800ms
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // Kiểm tra điều kiện hợp lệ của email
      if (value.length === 0) {
        showErrorToast("Vui lòng nhập email!", 1200);
        setIsValid({ ...isValid, email: false });
      } else if (!EMAILREGEX.test(value)) {
        showErrorToast("Email không hợp lệ! Vui lòng nhập đúng định dạng.", 1200);
        setIsValid({ ...isValid, email: false });
      } else {
        setIsValid({ ...isValid, email: true });
      }
    }, 800); // Thực hiện sau 800ms để giảm số lần kiểm tra khi người dùng nhập email
  };

  // Hàm xử lý khi submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn việc submit mặc định của form

    // Kiểm tra tính hợp lệ của các trường email và password
    if (
      isTouched.email &&
      isTouched.password &&
      isValid.password &&
      isValid.email
    ) {
      try {
        // Gọi API đăng nhập
        const result = await loginAPI(formData.email, formData.password);
        if (result.user) {
          showSuccessToast(result.message || "Đăng nhập thành công!", 1000);
          localStorage.setItem("user", JSON.stringify(result.user)); // Lưu thông tin user vào localStorage
          navigative("/"); // Điều hướng về trang chính sau khi đăng nhập thành công
        } else {
          showErrorToast(result.message || "Đăng nhập thất bại!", 1500);
        }
      } catch (error) {
        showErrorToast("Có lỗi xảy ra, vui lòng thử lại!", 1500);
      }
    } else {
      showErrorToast("Vui lòng nhập thông tin hợp lệ!", 1500);
    }
  };

  return (
    <div className={cx("wrapper")}>
      {/* Link về trang chủ */}
      <Link to={"/"} className={cx("home")}>
        <FontAwesomeIcon icon={faBook} /> Edu Quiz
      </Link>
      <div className={cx("container")}>
        <form onSubmit={handleSubmit}>
          {/* Logo trang */}
          <img src="/logoW.png" alt="Owl Logo" className={cx("logo")} />
          
          {/* Tiêu đề form */}
          <h2>ĐĂNG NHẬP</h2>

          {/* Input email */}
          <div className={cx("input-group")}>
            <span className={cx("input-icon")}>
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="text"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChangeEmail} // Gọi hàm kiểm tra email
            />
            {/* Hiển thị biểu tượng lỗi nếu email không hợp lệ */}
            {isTouched.email && !isValid.email && (
              <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
            )}
          </div>

          {/* Input password */}
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
            {/* Biểu tượng thay đổi kiểu hiển thị mật khẩu */}
            <FontAwesomeIcon
              className={cx("icon-eye")}
              icon={!showPassword.password ? faEye : faEyeSlash}
              onClick={() =>
                togglePasswordVisibility(setShowPassword, "password")
              }
            />
            {/* Hiển thị biểu tượng lỗi nếu password không hợp lệ */}
            {isTouched.password && !isValid.password && (
              <FontAwesomeIcon className={cx("icon-close")} icon={faClose} />
            )}
          </div>

          {/* Nút đăng nhập */}
          <div className={cx("login")}>
            <Button>Đăng nhập</Button>
          </div>

          {/* Liên kết đăng ký */}
          <div className={cx("signup")}>
            <a href="/signup">Đăng ký</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
