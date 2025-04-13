import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './EditSubjectPage.module.scss';
import { updateSubjectAPI } from '../../Api/api';

const cx = classNames.bind(styles);

function EditSubjectPage() {
  const { subject_id } = useParams();
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSubjectName('');
  }, [subject_id]);

  const handleUpdate = async () => {
    if (!subjectName.trim()) {
      setError('Tên môn học không được để trống.');
      return;
    }

    try {
      setLoading(true);
      const response = await updateSubjectAPI(subject_id, subjectName.trim());
      if (response && !response.message?.toLowerCase().includes('lỗi')) {
        Swal.fire({
          title: 'Đã cập nhật!',
          text: 'Môn học đã được cập nhật thành công.',
          icon: 'success',
          timer: 1500,
        });
        navigate('/admin');
      } else {
        setError(response.message || 'Không thể cập nhật môn học. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật môn học:', error);
      setError('Không thể cập nhật môn học. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('container')}>
      <button
        className={cx('back-btn')}
        onClick={() => navigate('/admin')}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
      </button>
      <h1 className={cx('title')}>Chỉnh sửa môn học</h1>
      <div className={cx('form')}>
        <label htmlFor="subject-name" className={cx('label')}>
          Tên môn học
        </label>
        <input
          id="subject-name"
          type="text"
          value={subjectName}
          onChange={(e) => {
            setSubjectName(e.target.value);
            setError('');
          }}
          placeholder="Nhập tên môn học"
          className={cx('input')}
        />
        {error && <p className={cx('error')}>{error}</p>}
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

export default EditSubjectPage;