import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      draggable
      limit={3}
      transition={Flip}
    />
  );
};

// Hàm hiển thị toast lỗi với thời gian tùy chỉnh
export const showErrorToast = (message, duration = 2000) => {
  toast.error(message, { autoClose: duration });
};

// Hàm hiển thị toast thành công với thời gian tùy chỉnh
export const showSuccessToast = (message, duration = 2000) => {
  toast.success(message, { autoClose: duration });
};

// Hàm hiển thị toast thông tin với thời gian tùy chỉnh
export const showInfoToast = (message, duration = 2000) => {
  toast.info(message, { autoClose: duration });  
};

// Hàm hiển thị toast cảnh báo với thời gian tùy chỉnh
export const showWarningToast = (message, duration = 2000) => {
  toast.warn(message, { autoClose: duration });  
};

export default ToastNotification;
