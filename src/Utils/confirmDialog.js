import Swal from "sweetalert2";

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
    title: title || "Bạn có chắc chắn?",
    text: text || "Sau khi nộp bài, bạn sẽ không thể thay đổi câu trả lời!",
    icon: icon || "warning",
    showCancelButton: true,
    confirmButtonText: btnYes || "Đồng ý",
    cancelButtonText: btnNo || "Hủy",
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === "function") {
      onConfirm();
    }
  });
};

export { showConfirmDialog };
