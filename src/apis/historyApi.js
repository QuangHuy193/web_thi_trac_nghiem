import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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
    console.error(`Lỗi khi lấy lịch sử bài thi có id là: ${exam_id}`, error);
    return [];
  }
};

export { getHistoryByUserIdAPI, getHistoryByExamIdAPI };
