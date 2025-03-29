import React, { useState } from "react";
import styles from "./SignUp.module.scss"; // Import đúng SCSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
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
              và Tên{" "}
            </label>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên người dùng"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />{" "}
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} /> Mật
              khẩu{" "}
            </label>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.labelWrapper}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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
