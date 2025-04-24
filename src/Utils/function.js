import { showErrorToast } from "./ToastNotification";
import { auth, provider, signInWithPopup } from "../configs/firebase.js";

const handleChangePass = (
  e,
  setFormData,
  setIsValid,
  setIsTouched,
  timeoutRef
) => {
  const value = e.target.value;

  setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  setIsTouched((prev) => ({ ...prev, [e.target.name]: true }));

  clearTimeout(timeoutRef.current);

  timeoutRef.current = setTimeout(() => {
    setIsValid((prev) => ({
      ...prev,
      password: value.length >= 8,
    }));

    if (value.length < 8) {
      showErrorToast("Mật khẩu phải có ít nhất 8 ký tự!", 1200);
    }
  }, 1200);
};

const togglePasswordVisibility = (setShowPassword, fieldName) => {
  setShowPassword((prev) => ({
    ...prev,
    [fieldName]: !prev[fieldName],
  }));
};

const getDifficultyLabel = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "Dễ";
    case "medium":
      return "Trung bình";
    case "hard":
      return "Khó";
    case "all":
      return "Tất cả";
    default:
      return "Không xác định";
  }
};

const removeVietnameseTones = (str) => {
  if (!str || typeof str !== "string") return "";

  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase(); // về chữ thường
};

const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Lấy ID Token (JWT) để gửi về backend xác thực
    const idToken = await user.getIdToken();

    return {
      user: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      },
      token: idToken,
    };
  } catch (error) {
    console.error("Lỗi đăng nhập với Google:", error);
    return null;
  }
};

const handleBack = (setHeaderTitle, header, setSelectedContent, content) => {
  setSelectedContent(content);
  setHeaderTitle(header);
};

export {
  handleChangePass,
  togglePasswordVisibility,
  getDifficultyLabel,
  removeVietnameseTones,
  loginGoogle,
  handleBack
};
