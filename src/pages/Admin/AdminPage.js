import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faCaretRight, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import classNames from 'classnames/bind';
import styles from './AdminPage.module.scss';
import { getAllSubjectsAPI } from '../../Api/api'; // Sửa đường dẫn import
const cx = classNames.bind(styles);

// Hàm tạo hiệu ứng xoay cho mũi tên
const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

function AdminPage() {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [subjects, setSubjects] = useState([]); // State để lưu danh sách môn học
  const [loading, setLoading] = useState(true); // State để xử lý trạng thái loading

  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  // Gọi API khi component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubjectsAPI();
        setSubjects(data); // Cập nhật danh sách môn học từ API
      } catch (error) {
        console.error('Lỗi khi lấy danh sách môn học:', error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchSubjects();
  }, []); // Dependency array rỗng để chỉ gọi API một lần khi mount

  const handleEdit = (id) => {
    console.log(`Sửa môn học với ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      console.log(`Xóa môn học với ID: ${id}`);
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
            <div
              className={cx('item', 'list')}
              onClick={toggleSubjectDropdown}
            >
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
                    <Link to="/admin/subject-list">Danh sách môn học</Link>
                  </div>
                  <div className={cx('dropdown-item')}>
                    <Link to="/admin/add-subject">Thêm môn học</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          <li className={cx('menu-item')}>Quản lý bài thi</li>
          <li className={cx('menu-item')}>Quản lý người dùng</li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Danh sách môn học</h1>
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
                    <td className={cx('table-cell')}>{subject.id}</td>
                    <td className={cx('table-cell')}>{subject.name}</td>
                    <td className={cx('table-cell')}>
                      <button
                        className={cx('edit-btn')}
                        onClick={() => handleEdit(subject.id)}
                        title="Sửa môn học"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className={cx('delete-btn')}
                        onClick={() => handleDelete(subject.id)}
                        title="Xóa môn học"
                      >
                        <FontAwesomeIcon icon={faTrash} />
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