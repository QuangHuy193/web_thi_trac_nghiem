import Swal from "sweetalert2";
import "./SweetAlert.scss";

/**
 * Hiển thị hộp thoại xác nhận
 * @param {string} title Tiêu đề hộp thoại
 * @param {string} text Nội dung hộp thoại
 * @param {icon} text Icon hộp thoại
 * @param {function} onConfirm Hàm thực thi khi người dùng xác nhận
 * @param {string} btnYes Nút xác nhận
 * @param {string} btnNo Nút hủy
 */
const showConfirmDialog = (title, text, icon, onConfirm, btnYes, btnNo) => {
  Swal.fire({
    title: title || "",
    text: text || "",
    icon: icon || "",
    showCancelButton: true,
    confirmButtonText: btnYes || "",
    cancelButtonText: btnNo || "",
    customClass: {
      popup: "custom-swal-popup",
      title: "custom-swal-title",     
      confirmButton: "custom-swal-confirm",
      cancelButton: "custom-swal-cancel",
    },
    didOpen: () => {
      document.querySelector(".swal2-html-container").classList.add("custom-swal-text");
  }
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === "function") {
      onConfirm();
    }
  });
};

export { showConfirmDialog };
