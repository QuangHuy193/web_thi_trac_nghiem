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

//them mon hoc moi
const addSubjectAPI = async (name) => {
  try {
    const response = await axios.post(`${API_URL}/subjects`, {
      name,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Trả về thông báo lỗi từ API
    }
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//xoa mon hoc
const deleteSubjectAPI = async (subject_id) => {
  try {
    const response = await axios.delete(`${API_URL}/subjects/${subject_id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//sua mon hoc
const updateSubjectAPI = async (subject_id, name) => {
  try {
    const response = await axios.put(`${API_URL}/subjects/${subject_id}`, {
      name,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra khi cập nhật môn học, vui lòng thử lại!" };
  }
};

//them mon hoc phan lop moi
const addSubSubjectAPI = async (name, subjectId) => {
  try {
    const response = await axios.post(`${API_URL}/subsubjects`, {
      subject_name: name,
      subject_id: subjectId,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm môn học phân lớp:", error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//xoa mon hoc phan lop
const deleteSubSubjectAPI = async (subsubject_id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/subsubjects/${subsubject_id}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

//sua mon hoc phan lop
const updateSubSubjectAPI = async (subsubject_id, subject_name) => {
  try {
    const response = await axios.put(
      `${API_URL}/subsubjects/${subsubject_id}`,
      {
        subject_name,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: "Có lỗi xảy ra khi cập nhật môn học, vui lòng thử lại!" };
  }
};

export  {
  getAllSubjectsAPI,
  getSubjectsAPI,
  getSubSubjectsAPI,
  updateSubSubjectAPI,
  deleteSubSubjectAPI,
  addSubSubjectAPI,
  updateSubjectAPI,
  deleteSubjectAPI,
  addSubjectAPI,
};
