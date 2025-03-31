import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

//lấy ds tất cả môn học
const getAllSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/subjects/subsubjects`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả môn học:", error);
    return [];
  }
};

//lấy ds bài thi thuộc môn học
const getAllExamsBySubSubjectId = async (subsubject_id) => {
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
const getQuestionBySubSubject = async (subsubject_id) => {
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

export { getAllSubjects, getAllExamsBySubSubjectId,getQuestionBySubSubject };
