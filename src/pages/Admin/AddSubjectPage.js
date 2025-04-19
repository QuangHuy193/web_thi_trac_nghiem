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
      console.log('Phản hồi từ API (chi tiết):', JSON.stringify(response, null, 2)); // Log chi tiết

      // Kiểm tra trạng thái thành công với các điều kiện cần thiết
      const isSuccess =
        (response.message && response.message.toLowerCase() === 'success') ||
        response.success === true ||
        (response.message && response.message === 'Môn học đã được thêm !') ||
        (response.subject);

      if (isSuccess) {
        setMessage({ type: 'success', text: 'Môn học đã được thêm !' });
        setSubjectName(''); // Reset form

        // Cập nhật danh sách môn học
        try {
          const updatedSubjects = await getAllSubjectsAPI();
          setSubjects(updatedSubjects);
        } catch (error) {
          console.error('Lỗi khi cập nhật danh sách môn học:', error);
        }
      } else {
        setMessage({ type: 'error', text: 'Không thể thêm môn học, vui lòng thử lại!' });
      }
    } catch (error) {
      console.error('Lỗi khi thêm môn học:', error);
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