import axios from "axios";
import { examApi } from ".";

const API_URL = process.env.REACT_APP_API_URL;

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

// sửa thông tin bài thi
const updateExamByExamIdAPI = async (
  exam_id,
  title,
  description,
  question_ids,
  time
) => {
  try {
    const response = await axios.put(`${API_URL}/exams/update/${exam_id}`, {
      title,
      description,
      question_ids,
      time,
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi sửa bài thi có id là: ${exam_id}`, error);
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

// Nộp bài
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

// Tạo bài thi
const makeExamAPI = async (
  title,
  description,
  time,
  created_by,
  subsubject_id,
  question_ids
) => {
  try {
    const response = await axios.post(`${API_URL}/exams`, {
      title,
      description,
      time,
      created_by,
      subsubject_id,
      question_ids,
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

export  {
  getAllExamsBySubSubjectIdAPI,
  getAllExamsByUserIdAPI,
  updateExamByExamIdAPI,
  deleteExamsByExamIdAPI,
  submitExamAPI,
  makeExamAPI,
};
