import { useState, useEffect } from 'react';
import { addSubSubjectAPI, getSubSubjectsAPI, getSubjectsAPI } from '../../apis';
import styles from './AddSubjectPage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {  useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function AddSubSubjectPage() {
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [message, setMessage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [mainSubjects, setMainSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const subSubjectsData = await getSubSubjectsAPI();
        console.log('Danh sách môn học phân lớp:', subSubjectsData);
        const validSubSubjects = Array.isArray(subSubjectsData)
          ? subSubjectsData.filter((subject) => subject && typeof subject.subject_name === 'string')
          : [];
        setSubjects(validSubSubjects);

        const mainSubjectsData = await getSubjectsAPI();
        console.log('Danh sách môn học tổng quát:', mainSubjectsData);
        const validMainSubjects = Array.isArray(mainSubjectsData)
          ? mainSubjectsData.filter((subject) => subject && typeof subject.subject_id === 'number' && typeof subject.name === 'string')
          : [];
        setMainSubjects(validMainSubjects);
        if (validMainSubjects.length > 0) {
          setSubjectId(validMainSubjects[0].subject_id.toString());
        } else {
          setMessage({ type: 'error', text: 'Không có môn học tổng quát nào để chọn. Vui lòng thêm môn học trước!' });
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setMessage({ type: 'error', text: 'Không thể tải dữ liệu.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setMessage({ type: 'error', text: 'Tên môn học phân lớp không được để trống!' });
      return;
    }
    if (!subjectId) {
      setMessage({ type: 'error', text: 'Vui lòng chọn môn học tổng quát!' });
      return;
    }

    const isDuplicate = subjects.some(
      (subject) =>
        subject &&
        typeof subject.subject_name === 'string' &&
        subject.subject_name.toLowerCase() === subjectName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setMessage({ type: 'error', text: 'Tên môn học phân lớp đã tồn tại!' });
      return;
    }

    try {     
      const parsedSubjectId = parseInt(subjectId);
      if (isNaN(parsedSubjectId)) {
        setMessage({ type: 'error', text: 'Môn học tổng quát không hợp lệ!' });
        return;
      }
      const response = await addSubSubjectAPI(subjectName.trim(), parsedSubjectId);
      console.log('Phản hồi từ API (chi tiết):', JSON.stringify(response, null, 2));
      console.log('Giá trị response.message:', response.message);

      // Kiểm tra trạng thái thành công
      const isSuccess =
        (response.message && response.message === 'Môn học phân lớp đã được tạo') ||
        (response.subsubject); // Thành công nếu API trả về subsubject

      console.log('Giá trị isSuccess:', isSuccess);

      if (isSuccess) {
        setMessage({ type: 'success', text: 'Môn học phân lớp đã được tạo !' });
        setSubjectName('');
        setSubjectId(mainSubjects[0]?.subject_id.toString() || '');
        const updatedSubjects = await getSubSubjectsAPI();
        const validUpdatedSubjects = Array.isArray(updatedSubjects)
          ? updatedSubjects.filter((subject) => subject && typeof subject.subject_name === 'string')
          : [];
        setSubjects(validUpdatedSubjects);
      } else {
        setMessage({ type: 'error', text: 'Không thể tạo môn học phân lớp, vui lòng thử lại!' });
      }
    } catch (error) {
      console.error('Lỗi khi thêm môn học phân lớp:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  };

  // Log khi message thay đổi để kiểm tra trạng thái cuối cùng
  useEffect(() => {
    if (message) {
      console.log('Message state đã cập nhật (chi tiết):', JSON.stringify(message, null, 2));
    }
  }, [message]);

  return (
    <div className={cx('add-subject-container')}>
      <aside className={cx('sidebar')}>
        <h2 className={cx('logo')}>Trang quản trị</h2>
        <ul className={cx('menu')}>
          <li className={cx('menu-item')}>Dashboard</li>
          <li className={cx('menu-item', 'active')}>Quản lý môn học</li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Thêm môn học phân lớp</h1>

        <div className={cx('section')}>
          <h2 className={cx('section-title')}>Thông tin môn học phân lớp</h2>
          <button
            className={cx('back-btn')}
            onClick={() => navigate('/admin/subsubject')}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
          </button>
          {loading ? (
            <p className={cx('loading')}>Đang tải dữ liệu...</p>
          ) : (
            <form className={cx('subject-form')} onSubmit={handleSubmit}>
              <div className={cx('form-group')}>
                <label className={cx('label')}>Môn học tổng quát</label>
                <select
                  className={cx('input')}
                  value={subjectId}
                  onChange={(e) => {                 
                    setSubjectId(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Chọn môn học tổng quát
                  </option>
                  {mainSubjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={cx('form-group')}>
                <label className={cx('label')}>Tên môn học phân lớp</label>
                <input
                  type="text"
                  className={cx('input')}
                  placeholder="Nhập tên môn học phân lớp"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
              </div>

              {message && (
                <div>
                  {console.log('Message trước khi render (chi tiết):', JSON.stringify(message, null, 2))}
                  <div
                    className={cx('message', {
                      'message-error': message.type !== 'success',
                      'message-success': message.type === 'success',
                    })}
                  >
                    {message.text}
                  </div>
                </div>
              )}

              <button type="submit" className={cx('submit-btn')} disabled={loading}>
                Thêm môn học phân lớp
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddSubSubjectPage;