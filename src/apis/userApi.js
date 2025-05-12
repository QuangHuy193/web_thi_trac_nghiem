import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

//đăng nhập
const loginAPI = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Kiểm tra nếu server trả về lỗi có response
    if (error.response && error.response.data) {
      return error.response.data; // Trả về thông báo lỗi từ API
    }

    // Nếu lỗi không có response từ server (lỗi mạng, timeout, ...)
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

// Đăng nhập vưới google
const loginGoogleAPI = async (id_token) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google`, {
      id_token,
    });
    return response.data;
  } catch (error) {
    // Kiểm tra nếu server trả về lỗi có response
    if (error.response && error.response.data) {
      return error.response.data; // Trả về thông báo lỗi từ API
    }

    // Nếu lỗi không có response từ server (lỗi mạng, timeout, ...)
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//sửa thông tin người dùng (trừ pass)
const updateUserInfoAPI = async (user_id, username, email) => {
  try {
    const response = await axios.put(`${API_URL}/users/${user_id}`, {
      username,
      email,
    });
    return response.data;
  } catch (error) {
    // Kiểm tra nếu server trả về lỗi có response
    if (error.response && error.response.data) {
      return error.response.data; // Trả về thông báo lỗi từ API
    }

    // Nếu lỗi không có response từ server (lỗi mạng, timeout, ...)
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

const updateUserPassInfoAPI = async (user_id, payload) => {
  try {
    // loại bỏ field password nếu không nhập gì
    if (!payload.password) {
      delete payload.password;
    }

    const response = await axios.put(`${API_URL}/users/${user_id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error); // In log cụ thể
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//đăng ký
const registerAPI = async (username, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      username,
      role,
    });
    return response.data;
  } catch (error) {
    // Kiểm tra nếu server trả về lỗi có response
    if (error.response && error.response.data) {
      return error.response.data; // Trả về thông báo lỗi từ API
    }

    // Nếu lỗi không có response từ server (lỗi mạng, timeout, ...)
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

// lấy thông tin người đã đã làm bài thi theo exam_id
const getListHistoryUserByExamIdAPI = async (exam_id) => {
  try {
    const response = await axios.get(`${API_URL}/history/exams/${exam_id}`);

    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy thông tin người đã làm bài thi có id là: ${exam_id}`,
      error
    );
    return [];
  }
};

// lay danh sach giao vien
const getAllTeachersAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    const teachers = Array.isArray(response.data)
      ? response.data
          .filter(
            (user) => user.role === "teacher" && user.username && user.email
          )
          .map((user) => ({
            ...user,
            user_id: user.user_id || user.id || user._id,
          }))
      : [];
    return teachers;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giáo viên:", error);
    return [];
  }
};

// xoa giao vien
const deleteTeacherAPI = async (user_id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${user_id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa giáo viên có id là: ${user_id}`, error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//lay tat ca nguoi dung
const getAllUsersAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Không thể lấy danh sách người dùng." }
    );
  }
};

//xoa nguoi dung
const deleteUserAPI = async (user_id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${user_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Không thể xóa người dùng." };
  }
};

// cap nhat role của người dùng
const updateUserRoleAPI = async (user_id, role) => {
  try {
    const response = await axios.put(`${API_URL}/users/${user_id}`, {
      role,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra khi cập nhật role, vui lòng thử lại!" };
  }
};

export {
  loginAPI,
  loginGoogleAPI,
  updateUserInfoAPI,
  updateUserPassInfoAPI,
  registerAPI,
  getListHistoryUserByExamIdAPI,
  deleteUserAPI,
  getAllUsersAPI,
  deleteTeacherAPI,
  getAllTeachersAPI,
  updateUserRoleAPI
};
