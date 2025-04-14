import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import styles from './AdminPage.module.scss';
import { getAllSubjectsAPI, deleteSubjectAPI } from '../../Api/api';

const cx = classNames.bind(styles);

const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

function AdminPage() {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  // Hàm lấy danh sách môn học
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getAllSubjectsAPI();
      setSubjects(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách môn học. Vui lòng thử lại.',
        icon: 'error',
      });
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lấy danh sách môn học khi component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Hàm xử lý xóa môn học
  const handleDelete = async (subject_id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa môn học này? Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(subject_id);
        const response = await deleteSubjectAPI(subject_id);
        // Kiểm tra phản hồi từ API
        if (response && !response.message?.toLowerCase().includes('lỗi')) {
          // Cập nhật danh sách từ server
          await fetchSubjects();
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Môn học đã được xóa thành công.',
            icon: 'success',
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: response.message || 'Không thể xóa môn học. Vui lòng thử lại.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Lỗi khi xóa môn học:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể xóa môn học. Vui lòng thử lại.',
          icon: 'error',
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  

  return (
    <div className={cx('admin-container')}>
      <aside className={cx('sidebar')}>
        <h2 className={cx('logo')}>Trang quản trị</h2>
        <ul className={cx('menu')}>
          <li className={cx('menu-item')}>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className={cx('menu-item')}>
            <div className={cx('item', 'list')} onClick={toggleSubjectDropdown}>
              <div>Quản lý môn học</div>
              <motion.span {...rotateArrow(isSubjectDropdownOpen)}>
                <FontAwesomeIcon icon={faCaretRight} className={cx('icon')} />
              </motion.span>
            </div>
            <AnimatePresence initial={false}>
              {isSubjectDropdownOpen && (
                <motion.div
                  key="subject-options"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cx('dropdown-menu')}
                >
                  <div className={cx('dropdown-item')}>
                    <Link to="/admin">Danh sách môn học</Link>
                  </div>
                  <div className={cx('dropdown-item')}>
                    <Link to="/admin/add-subject">Thêm môn học</Link>
                  </div>
                  <div className={cx('dropdown-item')}>
                    <Link to="/admin/subsubject">Danh sách môn học phân lớp</Link>
                  </div>
                  <div className={cx('dropdown-item')}>
                    <Link to="/admin/add-subsubject">Thêm môn học phân lớp</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
         
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Danh sách môn học</h1>
        <div className={cx('action-bar')}>
          <Link to="/admin/add-subject">
            <button className={cx('add-btn')}>
              <FontAwesomeIcon icon={faPlus} /> Thêm môn học
            </button>
          </Link>
        </div>
        <div className={cx('section')}>
          {loading ? (
            <p className={cx('no-data')}>Đang tải dữ liệu...</p>
          ) : subjects.length > 0 ? (
            <table className={cx('subject-table')}>
              <thead>
                <tr>
                  <th className={cx('table-header')}>ID</th>
                  <th className={cx('table-header')}>Tên môn học</th>
                  <th className={cx('table-header')}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className={cx('table-cell')}>{subject.subject_id}</td>
                    <td className={cx('table-cell')}>{subject.name}</td>
                    <td className={cx('table-cell')}>
                    <Link to={`/admin/edit-subject/${subject.subject_id}`}>
                        <button
                          className={cx('edit-btn')}
                          title="Sửa môn học"
                          disabled={deletingId === subject.subject_id}
                        >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      </Link>
                      <button
                        className={cx('delete-btn')}
                        onClick={() => handleDelete(subject.subject_id)}
                        title="Xóa môn học"
                        disabled={deletingId === subject.subject_id}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {deletingId === subject.subject_id && <span>Đang xóa...</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={cx('no-data')}>Không có môn học nào để hiển thị.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminPage;