import { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Info.module.scss";
import { updateUserInfoAPI } from "../../Api/api";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastNotification";
import { EMAILREGEX } from "../../Utils/const";

const cx = classNames.bind(styles);

function Info({ user, setUser }) {
  // Trạng thái hiển thị form chỉnh sửa (true: đang chỉnh sửa, false: xem thông tin)
  const [isEditing, setIsEditing] = useState(false);

  // Trạng thái lưu giá trị form cập nhật (họ tên và email)
  const [formUpdate, setFormUpdate] = useState({
    name: user.username,
    email: user.email,
  });

  // Hàm xử lý khi nhấn nút "Chỉnh sửa" hoặc "Lưu"
  const handleEdit = async () => {
    let err = "";

    if (isEditing) {
      // Kiểm tra hợp lệ dữ liệu trước khi lưu
      if (!formUpdate.name) {
        err = "Tên không được để trống!";
      } else if (!EMAILREGEX.test(formUpdate.email)) {
        err = "Email không đúng định dạng!";
      }

      if (err) {
        showErrorToast(err, 1200); // Hiển thị lỗi nếu có
      } else {
        try {
          // Gửi yêu cầu cập nhật thông tin lên API
          const result = await updateUserInfoAPI(
            user.user_id,
            formUpdate.name,
            formUpdate.email
          );

          if (result.user) {
            // Cập nhật thành công: hiển thị toast + cập nhật state user
            showSuccessToast("Cập nhật thông tin thành công", 1200);
            const updatedUser = {
              ...user,
              username: formUpdate.name,
              email: formUpdate.email,
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          } else {
            // Lỗi từ server
            showErrorToast(result.message, 1200);
          }
        } catch (error) {
          showErrorToast("Có lỗi xảy ra. Vui lòng thử lại...", 1200);
        }

        setIsEditing(false); // Sau khi lưu thì thoát chế độ chỉnh sửa
      }
    } else {
      // Nếu chưa ở chế độ chỉnh sửa thì bật chế độ chỉnh sửa
      setIsEditing(true);
    }
  };

  // Hủy chỉnh sửa: reset lại giá trị và thoát khỏi chế độ chỉnh sửa
  const handleExit = () => {
    setFormUpdate({
      name: user.username,
      email: user.email,
    });

    setIsEditing(false);
  };

  // Cập nhật giá trị khi người dùng thay đổi input
  const handleChange = (e) => {
    setFormUpdate({ ...formUpdate, [e.target.name]: e.target.value });
  };

  return (
    <div className={cx("info-container")}>
      <h2>Thông tin cá nhân</h2>

      {/* Hiển thị hoặc chỉnh sửa họ tên */}
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

      {/* Hiển thị hoặc chỉnh sửa email */}
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

      {/* Hiển thị role của người dùng */}
      <div className={cx("info-item")}>
        <label>Role:</label>
        <span>{user.role}</span>
      </div>

      {/* Nút "Chỉnh sửa" hoặc "Lưu" */}
      <button onClick={handleEdit} className={cx("button")}>
        {isEditing ? "Lưu" : "Chỉnh sửa"}
      </button>

      {/* Nút "Hủy" chỉ hiển thị khi đang chỉnh sửa */}
      {isEditing && (
        <button onClick={handleExit} className={cx("button-exit")}>
          Hủy
        </button>
      )}
    </div>
  );
}


export default Info;
