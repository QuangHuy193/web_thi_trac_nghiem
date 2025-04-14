import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './EditSubjectPage.module.scss';
import { updateSubSubjectAPI, getSubSubjectsAPI} from '../../Api/api';

const cx = classNames.bind(styles);

function EditSubSubjectPage() {
  const { subsubject_id } = useParams();
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu môn học phân lớp khi vào trang
  useEffect(() => {
    const fetchSubSubject = async () => {
      try {
        setLoading(true);
        const subSubjectData = await getSubSubjectsAPI (subsubject_id);
        if (subSubjectData) {
          setSubjectName(subSubjectData.subject_name || '');
        } else {
          setError('Không thể tải thông tin môn học phân lớp.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu môn học phân lớp:', error);
        setError('Không thể tải dữ liệu môn học phân lớp.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubSubject();
  }, [subsubject_id]);

  const handleUpdate = async () => {
    if (!subjectName.trim()) {
      setError('Tên môn học không được để trống.');
      return;
    }

    try {
      setLoading(true);
      const response = await updateSubSubjectAPI(subsubject_id, subjectName.trim());
      if (response && response.message?.includes('đã được')) {
        Swal.fire({
          title: 'Đã cập nhật!',
          text: 'Môn học phân lớp đã được cập nhật thành công.',
          icon: 'success',
          timer: 1500,
        });
        navigate('/admin/subsubject');
      } else {
        setError(response.message || 'Không thể cập nhật môn học phân lớp. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật môn học phân lớp:', error);
      setError('Không thể cập nhật môn học phân lớp. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('container')}>
      <button
        className={cx('back-btn')}
        onClick={() => navigate('/admin/subsubject')}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
      </button>
      <h1 className={cx('title')}>Chỉnh sửa môn học phân lớp</h1>
      <div className={cx('form')}>
        <label htmlFor="subject-name" className={cx('label')}>
          Tên môn học phân lớp
        </label>
        <input
          id="subject-name"
          type="text"
          value={subjectName}
          onChange={(e) => {
            setSubjectName(e.target.value);
            setError('');
          }}
          placeholder="Nhập tên môn học phân lớp"
          className={cx('input')}
          disabled={loading}
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

export default EditSubSubjectPage;