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

//lấy ds bài thi thuộc môn học
const getAllExamsBySubSubjectIdAPI = async (subsubject_id) => {
  try {
    const response = await axios.get(`${API_URL}/exams/${subsubject_id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách bài thi của môn học có id là: ${subsubject_id}`,
      error
    );
    return [];
  }
};

//lấy ds bài thi thuộc môn học
const getQuestionBySubSubjectAPI = async (subsubject_id) => {
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

//lấy ds bài thi thuộc môn học
const loginAPI = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`,{
      email,
      password
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

export {
  getAllSubjectsAPI,
  getAllExamsBySubSubjectIdAPI,
  getQuestionBySubSubjectAPI,
  loginAPI,
};
