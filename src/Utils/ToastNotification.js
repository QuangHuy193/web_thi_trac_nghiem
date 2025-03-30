import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      draggable
    />
  );
};

// Hàm hiển thị toast lỗi với thời gian tùy chỉnh
export const showErrorToast = (message, duration = 2500) => {
  toast.error(message, { autoClose: duration });
};

// Hàm hiển thị toast thành công với thời gian tùy chỉnh
export const showSuccessToast = (message, duration = 2500) => {
  toast.success(message, { autoClose: duration });
};

export default ToastNotification;
