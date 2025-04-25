import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './EditSubjectPage.module.scss';
import { updateUserPassInfoAPI } from '../../Api/api';

const cx = classNames.bind(styles);

function EditUserPage() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!username.trim() || !email.trim()) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Tên và email không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Email không hợp lệ!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }


    try {
      setLoading(true);
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim() || undefined, 
      };
      
      const response = await updateUserPassInfoAPI(user_id, payload);

      if (response && response.message?.toLowerCase().includes('cập nhật')) {
        await Swal.fire({
          title: 'Đã cập nhật!',
          text: 'Thông tin người dùng đã được cập nhật thành công.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/admin/user-list');
      } else {
        Swal.fire({
          title: 'Lỗi!',
          text: response.message || 'Không thể cập nhật thông tin người dùng. Vui lòng thử lại.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể cập nhật thông tin người dùng. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('container')}>
      <button className={cx('back-btn')} onClick={() => navigate('/admin/user-list')}>
        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
      </button>
      <h1 className={cx('title')}>Chỉnh sửa thông tin người dùng</h1>
      <div className={cx('form')}>
        <label htmlFor="username" className={cx('label')}>Họ và tên</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập họ và tên"
          className={cx('input')}
          disabled={loading}
        />

        <label htmlFor="email" className={cx('label')}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email"
          className={cx('input')}
          disabled={loading}
        />

        <label htmlFor="password" className={cx('label')}>Mật khẩu mới</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          className={cx('input')}
          disabled={loading}
        />

        <button
          className={cx('update-btn')}
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default EditUserPage;
