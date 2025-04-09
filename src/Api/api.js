import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

//lấy ds tất cả môn học
const getAllSubjectsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/subjects/subsubjects`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả môn học:", error);
    return [];
  }
};

//lấy ds môn học tổng
const getSubjectsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/subjects`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả môn học:", error);
    return [];
  }
};

//lấy ds môn học con
const getSubSubjectsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/subsubjects`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả môn học:", error);
    return [];
  }
};

//lấy ds bài thi thuộc môn học
const getAllExamsBySubSubjectIdAPI = async (subsubject_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/exams/quests/${subsubject_id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách bài thi của môn học có id là: ${subsubject_id}`,
      error
    );
    return [];
  }
};

//lấy ds bài thi theo user_id người tạo
const getAllExamsByUserIdAPI = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/exams/creator/${user_id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách bài thi của môn học có id là: ${user_id}`,
      error
    );
    return [];
  }
};

//xóa bài thi theo exam_id
const deleteExamsByExamIdAPI = async (exam_id) => {
  try {
    const response = await axios.delete(`${API_URL}/exams/quest/${exam_id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi xóa bài thi có id là: ${exam_id}`, error);
    return [];
  }
};

//lấy ds câu hỏi thuộc môn học
const getQuestionBySubSubjectIdAPI = async (subsubject_id) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${subsubject_id}`);

    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách câu hỏi của môn học có id là: ${subsubject_id}`,
      error
    );
    return [];
  }
};

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

//nộp bài
const submitExamAPI = async (
  user_id,
  exam_id,
  started_at,
  finished_at,
  answers
) => {
  try {
    const response = await axios.post(`${API_URL}/history/submit`, {
      user_id,
      exam_id,
      started_at,
      finished_at,
      answers,
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

//tạo câu hỏi
const makeQuestionAPI = async (
  subject_id,
  question_text,
  difficulty,
  created_by,
  answers
) => {
  try {
    const response = await axios.post(`${API_URL}/questions`, {
      subject_id,
      question_text,
      difficulty,
      created_by,
      answers,
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

// lấy lịch sử làm bài theo user_id
const getHistoryByUserIdAPI = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/history/${user_id}`);

    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy lịch sử làm bài của người dùng có id là: ${user_id}`,
      error
    );
    return [];
  }
};

// lấy lịch sử bài thi theo exam_id
const getHistoryByExamIdAPI = async (exam_id) => {
  try {
    const response = await axios.get(`${API_URL}/history/ans/${exam_id}`);

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bài thi có id là: ${exam_id}`, error);
    return [];
  }
};

export {
  getAllSubjectsAPI,
  getSubjectsAPI,
  getSubSubjectsAPI,
  getAllExamsBySubSubjectIdAPI,
  getAllExamsByUserIdAPI,
  getQuestionBySubSubjectIdAPI,
  loginAPI,
  updateUserInfoAPI,
  registerAPI,
  makeQuestionAPI,
  submitExamAPI,
  deleteExamsByExamIdAPI,
  getHistoryByUserIdAPI,
  getHistoryByExamIdAPI,
};
