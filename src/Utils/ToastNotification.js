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

// Hàm hiển thị toast lỗi
export const showErrorToast = (message) => {
  toast.error(message);
};

// Hàm hiển thị toast thành công
export const showSuccessToast = (message) => {
  toast.success(message);
};

export default ToastNotification;
