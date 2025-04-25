import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import styles from './AdminPage.module.scss';
import { getAllTeachersAPI, deleteTeacherAPI } from '../../Api/api';

const cx = classNames.bind(styles);

const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

function TeacherPage() {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  const toggleTeacherDropdown = () => {
    setIsTeacherDropdownOpen(!isTeacherDropdownOpen);
  };
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await getAllTeachersAPI();
      setTeachers(data);
    } catch (error) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách giáo viên. Vui lòng thử lại.',
        icon: 'error',
      });
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (user_id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa giáo viên này? Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(user_id);
        const response = await deleteTeacherAPI(user_id);
        if (response.success || !response.message?.toLowerCase().includes('lỗi')) {
          await fetchTeachers();
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Giáo viên đã được xóa thành công.',
            icon: 'success',
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: response.message || 'Không thể xóa giáo viên. Vui lòng thử lại.',
            icon: 'error',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể xóa giáo viên. Vui lòng thử lại.',
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
           <li className={cx('menu-item')}>
                    <div className={cx('item', 'list')} onClick={toggleTeacherDropdown}>
                      <div>Quản lý giáo viên</div>
                      <motion.span {...rotateArrow(isTeacherDropdownOpen)}>
                        <FontAwesomeIcon icon={faCaretRight} className={cx('icon')} />
                      </motion.span>
                    </div>
                    <AnimatePresence initial={false}>
                      {isTeacherDropdownOpen && (
                        <motion.div
                          key="teacher-options"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cx('dropdown-menu')}
                        >
                          <div className={cx('dropdown-item')}>
                            <Link to="/admin/create-teacher">Tạo tài khoản giáo viên</Link>
                          </div>
                          <div className={cx('dropdown-item')}>
                            <Link to="/admin/teacher">Danh sách giáo viên</Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                  <li className={cx('menu-item')}>
                    <div className={cx('item', 'list')} onClick={toggleUserDropdown}>
                      <div>Quản lý người dùng</div>
                      <motion.span {...rotateArrow(isUserDropdownOpen)}>
                        <FontAwesomeIcon icon={faCaretRight} className={cx('icon')} />
                      </motion.span>
                    </div>
                    <AnimatePresence initial={false}>
                      {isUserDropdownOpen && (
                        <motion.div
                          key="user-options"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cx('dropdown-menu')}>
                          <div className={cx('dropdown-item')}>
                            <Link to="/admin/user-list">Danh sách người dùng</Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Danh sách giáo viên</h1>
        <div className={cx('action-bar')}>
          <Link to="/admin/create-teacher">
            <button className={cx('add-btn')}>
              <FontAwesomeIcon icon={faPlus} /> Thêm giáo viên
            </button>
          </Link>
        </div>
        <div className={cx('section')}>
          {loading ? (
            <p className={cx('no-data')}>Đang tải dữ liệu...</p>
          ) : teachers.length > 0 ? (
            <table className={cx('subject-table')}>
              <thead>
                <tr>
                  <th className={cx('table-header')}>ID</th>
                  <th className={cx('table-header')}>Họ và tên</th>
                  <th className={cx('table-header')}>Email</th>
                  <th className={cx('table-header')}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.user_id}>
                    <td className={cx('table-cell')}>{teacher.user_id || 'N/A'}</td>
                    <td className={cx('table-cell')}>{teacher.username}</td>
                    <td className={cx('table-cell')}>{teacher.email}</td>
                    <td className={cx('table-cell')}>
                      <Link to={`/admin/edit-teacher/${teacher.user_id}`}>
                        <button
                          className={cx('edit-btn')}
                          title="Sửa thông tin giáo viên"
                          disabled={deletingId === teacher.user_id}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
                      <button
                        className={cx('delete-btn')}
                        onClick={() => handleDelete(teacher.user_id)}
                        title="Xóa giáo viên"
                        disabled={deletingId === teacher.user_id}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {deletingId === teacher.user_id && <span>Đang xóa...</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={cx('no-data')}>Không có giáo viên nào để hiển thị.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default TeacherPage;