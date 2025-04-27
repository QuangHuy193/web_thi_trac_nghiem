import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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

// lấy danh sách câu hỏi theo user_id
const getQuestionByUserIdAPI = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/questions/creator/${user_id}`);

    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách câu hỏi được tạo bởi của người dùng có id là: ${user_id}`,
      error
    );
    return [];
  }
};

// xóa câu hỏi
const deleteQuestionAPI = async (question_id) => {
  try {
    const response = await axios.delete(`${API_URL}/questions/${question_id}`);

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa câu hỏi có id là: ${question_id}`, error);
    return [];
  }
};

// cập nhật câu hỏi
const updateQuestionAPI = async (
  question_id,
  question_text,
  difficulty,
  answers,
  subject_id
) => {
  console.log(question_id);
  try {
    const response = await axios.put(`${API_URL}/questions/${question_id}`, {
      question_text,
      difficulty,
      answers,
      subject_id,
    });

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật câu hỏi có id là: ${question_id}`, error);
    return [];
  }
};

export  {
  getQuestionBySubSubjectIdAPI,
  makeQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
  getQuestionByUserIdAPI,
};
