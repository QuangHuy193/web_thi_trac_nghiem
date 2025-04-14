import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import styles from './AdminPage.module.scss';
import { getSubSubjectsAPI, deleteSubSubjectAPI } from '../../Api/api';

const cx = classNames.bind(styles);

const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

function SubSubjectPage() {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubSubjectsAPI();
      console.log('Danh sách môn học phân lớp:', data);
      const validSubjects = Array.isArray(data)
        ? data.filter((subject) => subject && typeof subject.subject_name === 'string')
        : [];
      setSubjects(validSubjects);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học phân lớp:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách môn học phân lớp. Vui lòng thử lại.',
        icon: 'error',
      });
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async (subsubject_id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa môn học phân lớp này? Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(subsubject_id);
        const response = await deleteSubSubjectAPI(subsubject_id);
        if (response && !response.message?.toLowerCase().includes('lỗi')) {
          await fetchSubjects();
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Môn học phân lớp đã được xóa thành công.',
            icon: 'success',
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: response.message || 'Không thể xóa môn học phân lớp. Vui lòng thử lại.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Lỗi khi xóa môn học phân lớp:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể xóa môn học phân lớp. Vui lòng thử lại.',
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
            <Link to="/admin/exam-management">Quản lý bài thi</Link>
          </li>
          <li className={cx('menu-item')}>
            <Link to="/admin/user-management">Quản lý người dùng</Link>
          </li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Danh sách môn học phân lớp</h1>
        <div className={cx('action-bar')}>
          <Link to="/admin/add-subsubject">
            <button className={cx('add-btn')}>
              <FontAwesomeIcon icon={faPlus} /> Thêm môn học phân lớp
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
                  <th className={cx('table-header')}>Tên môn học phân lớp</th>
                  <th className={cx('table-header')}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.subsubjects_id}>
                    <td className={cx('table-cell')}>{subject.subsubjects_id}</td>
                    <td className={cx('table-cell')}>{subject.subject_name}</td>
                    <td className={cx('table-cell')}>
                      <Link to={`/admin/edit-subsubject/${subject.subsubjects_id}`}>
                        <button
                          className={cx('edit-btn')}
                          title="Sửa môn học phân lớp"
                          disabled={deletingId === subject.subsubjects_id}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
                      <button
                        className={cx('delete-btn')}
                        onClick={() => handleDelete(subject.subsubjects_id)}
                        title="Xóa môn học phân lớp"
                        disabled={deletingId === subject.subsubjects_id}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {deletingId === subject.subsubjects_id && <span>Đang xóa...</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={cx('no-data')}>Không có môn học phân lớp nào để hiển thị.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default SubSubjectPage;