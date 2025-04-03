import { useState } from "react";
import styles from "./Info.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Info({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formUpdate, setFormUpdate] = useState({
    name: user.username,
    email: user.email,
  });

  const handleEdit = async () => {
    if (isEditing) {
        try {
            //!
        } catch (error) {
            
        }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    // gọi api xử lý sửa thông tin
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
    </div>
  );
}

export default Info;
