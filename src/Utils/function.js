import { showErrorToast } from "./ToastNotification";

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
  }, 800);
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
    default:
      return "Không xác định";
  }
};

export { handleChangePass, togglePasswordVisibility, getDifficultyLabel };
