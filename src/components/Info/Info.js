import { useState } from "react";
import styles from "./Info.module.scss";
import classNames from "classnames/bind";
import { updateUserInfoAPI } from "../../Api/api";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { EMAILREGEX } from "../../Utils/const";

const cx = classNames.bind(styles);

function Info({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formUpdate, setFormUpdate] = useState({
    name: user.username,
    email: user.email,
  });

  const handleEdit = async () => {
    let err = "";
    if (isEditing) {
      if (!formUpdate.name) {
        err = "Tên không được để trống!";
      } else if (!EMAILREGEX.test(formUpdate.email)) {
        err = "Email không đúng định dạng!";
      }

      if (err) {
        showErrorToast(err, 1200);
      } else {
        try {
          const result = await updateUserInfoAPI(
            user.user_id,
            formUpdate.name,
            formUpdate.email
          );

          if (result.user) {
            showSuccessToast("Cập nhật thông tin thành công", 1200);
            setUser({
              ...user,
              username: formUpdate.name,
              email: formUpdate.email,
            });
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            showErrorToast(result.message, 1200);
          }
        } catch (error) {
          showErrorToast("Có lỗi xảy ra. Vui lòng thử lại...", 1200);
        }
        setIsEditing(!isEditing);
      }
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleExit = () => {
    setFormUpdate({
      name: user.username,
      email: user.email,
    });

    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormUpdate({ ...formUpdate, [e.target.name]: e.target.value });
  };

  return (
    <div className={cx("info-container")}>
      <h2>Thông tin cá nhân</h2>
      <div className={cx("info-item")}>
        <label>Họ và tên:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formUpdate.name}
            onChange={handleChange}
            className={cx("input")}
          />
        ) : (
          <span>{user.username}</span>
        )}
      </div>
      <div className={cx("info-item")}>
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formUpdate.email}
            onChange={handleChange}
            className={cx("input")}
          />
        ) : (
          <span>{user.email}</span>
        )}
      </div>
      <div className={cx("info-item")}>
        <label>Role:</label>
        <span>{user.role}</span>
      </div>
      <button onClick={handleEdit} className={cx("button")}>
        {isEditing ? "Lưu" : "Chỉnh sửa"}
      </button>
      {isEditing && (
        <button onClick={handleExit} className={cx("button-exit")}>
          Hủy
        </button>
      )}
    </div>
  );
}

export default Info;
