import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

//lấy ds tất cả môn học
const getAllSubjects = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/subjects/subsubjects`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả môn học:", error);
    return [];
  }
};

export { getAllSubjects };
