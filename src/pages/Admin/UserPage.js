import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faEdit, faTrash, faRightFromBracket,faChartBar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import styles from './AdminPage.module.scss';
import { getAllUsersAPI, deleteUserAPI, updateUserRoleAPI } from '../../apis/userApi.js';

const cx = classNames.bind(styles);

const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

function UserPage() {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null); // State để theo dõi user đang được cập nhật role

  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  const toggleTeacherDropdown = () => {
    setIsTeacherDropdownOpen(!isTeacherDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Lấy tất cả user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersAPI();
      // Lọc role
      const validUsers = Array.isArray(data)
        ? data.filter(user => 
            user && 
            user.user_id && 
            user.username && 
            user.email && 
            ['student', 'teacher'].includes(user.role.toLowerCase()) // Lọc cả student và teacher
          )
        : [];
      setUsers(validUsers);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách người dùng. Vui lòng thử lại.',
        icon: 'error',
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Đăng xuất
  const handleClickLogout = () => {
    Swal.fire({
      title: 'Xác nhận đăng xuất',
      text: 'Bạn có chắc muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
      }
    });
  };

  // Handle xóa user
  const handleDelete = async (user_id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!',
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
        const response = await deleteUserAPI(user_id);
        if (response.message && !response.message.toLowerCase().includes('lỗi')) {
          await fetchUsers();
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Người dùng đã được xóa thành công.',
            icon: 'success',
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: response.message || 'Không thể xóa người dùng. Vui lòng thử lại.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra, vui lòng thử lại!',
          icon: 'error',
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle edit user (navigate to edit page)
  const handleEdit = (user_id) => {
    window.location.href = `/admin/edit-user/${user_id}`;
  };

  // Handle thay đổi role
  const handleChangeRole = async (user_id, currentRole) => {
    const newRole = currentRole.toLowerCase() === 'student' ? 'teacher' : 'student';
    
    const result = await Swal.fire({
      title: 'Xác nhận thay đổi quyền',
      text: `Bạn có chắc muốn thay đổi quyền của người dùng này thành ${newRole === 'student' ? 'Học sinh' : 'Giáo viên'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thay đổi',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        setUpdatingRoleId(user_id);
        const response = await updateUserRoleAPI(user_id, newRole);
        if (response.message && !response.message.toLowerCase().includes('lỗi')) {
          await fetchUsers(); // Cập nhật lại danh sách người dùng
          Swal.fire({
            title: 'Thành công!',
            text: `Đã thay đổi quyền thành ${newRole === 'student' ? 'Học sinh' : 'Giáo viên'}.`,
            icon: 'success',
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: response.message || 'Không thể thay đổi quyền. Vui lòng thử lại.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Lỗi khi thay đổi quyền:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra, vui lòng thử lại!',
          icon: 'error',
        });
      } finally {
        setUpdatingRoleId(null);
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
                  className={cx('dropdown-menu')}
                >
                  <div className={cx('dropdown-item')}>
                    <Link to="/admin/user-list">Danh sách người dùng</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          <li className={cx('menu-item')}>
            <Link to="/admin/chart">
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              Thống kê 
            </Link>
          </li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <div className={cx('header')}>
          <h1 className={cx('title')}>Danh sách người dùng</h1>
          <FontAwesomeIcon
            className={cx('logout')}
            icon={faRightFromBracket}
            onClick={handleClickLogout}
            title="Đăng xuất"
          />
        </div>    
        <div className={cx('section')}>
          {loading ? (
            <p className={cx('no-data')}>Đang tải dữ liệu...</p>
          ) : users.length > 0 ? (
            <table className={cx('subject-table')}>
              <thead>
                <tr>
                  <th className={cx('table-header')}>ID</th>
                  <th className={cx('table-header')}>Tên người dùng</th>
                  <th className={cx('table-header')}>Email</th>
                  <th className={cx('table-header')}>Quyền</th>
                  <th className={cx('table-header')}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td className={cx('table-cell')}>{user.user_id || 'N/A'}</td>
                    <td className={cx('table-cell')}>{user.username}</td>
                    <td className={cx('table-cell')}>{user.email}</td>
                    <td className={cx('table-cell')}>
                      {user.role.toLowerCase() === 'student' ? 'Học sinh' : 'Giáo viên'}
                    </td>
                    <td className={cx('table-cell')}>
                      <Link to={`/admin/edit-user/${user.user_id}`}>
                        <button
                          className={cx('edit-btn')}
                          title="Sửa thông tin người dùng"
                          disabled={updatingRoleId === user.user_id || deletingId === user.user_id}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
                      <button
                        className={cx('delete-btn')}
                        onClick={() => handleDelete(user.user_id)}
                        title="Xóa người dùng"
                        disabled={updatingRoleId === user.user_id || deletingId === user.user_id}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {deletingId === user.user_id && <span>Đang xóa...</span>}
                      </button>
                      <button
                        className={cx('edit-btn')}
                        onClick={() => handleChangeRole(user.user_id, user.role)}
                        title="Thay đổi quyền"
                        disabled={updatingRoleId === user.user_id || deletingId === user.user_id}
                      >
                        {updatingRoleId === user.user_id ? 'Đang cập nhật...' : 'Thay đổi quyền'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={cx('no-data')}>Không có người dùng nào để hiển thị.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserPage;