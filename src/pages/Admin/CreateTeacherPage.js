import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './AddSubjectPage.module.scss'; 
import { registerAPI } from '../../apis';

const cx = classNames.bind(styles);

function CreateTeacherPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // ham xu ly thay doi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    // rang buoc du lieu
    if (!username || !email || !password) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin!' });
      return;
    }

    // rang buoc dinh dang email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Email không hợp lệ!' });
      return;
    }

   
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 8 ký tự!' });
      return;
    }

    try {
      setIsSubmitting(true);
      //goi api role  teacher
      const response = await registerAPI(username, email, password, 'teacher');
      console.log('Phản hồi từ API (chi tiết):', JSON.stringify(response, null, 2));

      // kiem tra trang thai thanh cong
      const isSuccess = response.message && response.message.toLowerCase().includes('thành công');
      console.log('isSuccess:', isSuccess); 

      if (isSuccess) {
        setMessage({ type: 'success', text: response.message || 'Tài khoản giáo viên đã được tạo!' });
        setFormData({ username: '', email: '', password: '' }); 
      } else {
        setMessage({ type: 'error', text: response.message || 'Không thể tạo tài khoản, vui lòng thử lại!' });
      }
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản giáo viên:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <li className={cx('menu-item', 'active')}>Quản lý giáo viên</li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Tạo tài khoản giáo viên</h1>

        <div className={cx('section')}>
          <button
            className={cx('back-btn')}
            onClick={() => navigate('/admin/teacher')}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
          </button>
          <h2 className={cx('section-title')}>Thông tin giáo viên</h2>
          <form className={cx('subject-form')} onSubmit={handleSubmit}>
            <div className={cx('form-group')}>
              <label className={cx('label')}>Họ và tên</label>
              <input
                type="text"
                name="username"
                className={cx('input')}
                placeholder="Nhập họ và tên"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className={cx('form-group')}>
              <label className={cx('label')}>Email</label>
              <input
                type="email"
                name="email"
                className={cx('input')}
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className={cx('form-group')}>
              <label className={cx('label')}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                className={cx('input')}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
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

            <button
              type="submit"
              className={cx('submit-btn')}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateTeacherPage;