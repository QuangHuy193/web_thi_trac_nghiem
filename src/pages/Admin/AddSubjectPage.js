import { useState, useEffect } from 'react';
import { addSubjectAPI, getAllSubjectsAPI } from '../../Api/api';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AddSubjectPage.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

function AddSubjectPage() {
  const [subjectName, setSubjectName] = useState('');
  const [message, setMessage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy danh sách môn học khi component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data = await getAllSubjectsAPI();
        setSubjects(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách môn học:', error);
        setMessage({ type: 'error', text: 'Không thể tải danh sách môn học.' });
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setMessage({ type: 'error', text: 'Tên môn học không được để trống!' });
      return;
    }

    // Kiểm tra tên môn học trùng lặp
    const isDuplicate = subjects.some(
      (subject) => subject.name.toLowerCase() === subjectName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setMessage({ type: 'error', text: 'Tên môn học đã tồn tại!' });
      return;
    }

    try {
      const response = await addSubjectAPI(subjectName.trim());
      if (response.message === 'Success') {
        setMessage({ type: 'success', text: 'Thêm môn học thành công!' });
        setSubjectName(''); // Reset form
        // Cập nhật danh sách môn học
        const updatedSubjects = await getAllSubjectsAPI();
        setSubjects(updatedSubjects);
      } else {
        setMessage({ type: 'error', text: response.message || 'Có lỗi xảy ra!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  };

  return (
    <div className={cx('add-subject-container')}>

      <aside className={cx('sidebar')}>
        <h2 className={cx('logo')}>Trang quản trị</h2>
        <ul className={cx('menu')}>
          <li className={cx('menu-item')}>Dashboard</li>
          <li className={cx('menu-item', 'active')}>Quản lý môn học</li>
          <li className={cx('menu-item')}>Quản lý bài thi</li>
          <li className={cx('menu-item')}>Quản lý người dùng</li>
        </ul>
      </aside>

      <main className={cx('main')}>
       
        <h1 className={cx('title')}>Thêm môn học</h1>

        <div className={cx('section')}>
        <button
                className={cx('back-btn')}
                onClick={() => navigate('/admin')}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
              </button>
          <h2 className={cx('section-title')}>Thông tin môn học</h2>
          {loading ? (
            <p className={cx('loading')}>Đang tải dữ liệu...</p>
          ) : (
            <form className={cx('subject-form')} onSubmit={handleSubmit}>
              <div className={cx('form-group')}>
                <label className={cx('label')}>Tên môn học</label>
                <input
                  type="text"
                  className={cx('input')}
                  placeholder="Nhập tên môn học"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
              </div>

              {/* Hiển thị thông báo */}
              {message && (
                <div
                  className={cx('message', {
                    'message-error': message.type === 'error',
                    'message-success': message.type === 'success',
                  })}
                >
                  {message.text}
                </div>
              )}

              <button type="submit" className={cx('submit-btn')} disabled={loading}>
                Thêm môn học
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddSubjectPage;