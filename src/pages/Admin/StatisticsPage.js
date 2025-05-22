import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faRightFromBracket, faChartBar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';
import styles from './AdminPage.module.scss';
import Chart from 'chart.js/auto';
import { getAllUsersAPI } from '../../apis/userApi';

const cx = classNames.bind(styles);

const rotateArrow = (isOpen) => ({
  animate: { rotate: isOpen ? 90 : 0 },
  transition: { duration: 0.3 },
});

function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    usersPerDay: { labels: [], data: [] }, // Dữ liệu cho biểu đồ
    totalUsers: 0, // Tổng số người dùng
    totalUsersInMonth: 0, // Tổng số người dùng được tạo trong tháng
  });

  // State cho dropdowns
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Hàm toggle cho dropdown
  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  const toggleTeacherDropdown = () => {
    setIsTeacherDropdownOpen(!isTeacherDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  //lay danh sach nguoi dung va tinh toan thong ke
  const fetchUsersAndCalculateStats = async () => {
    try {
      const year = new Date().getFullYear(); // 2025
      const month = new Date().getMonth(); // 3 (tháng 4, vì tháng bắt đầu từ 0)
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // So ngay trong thang
      const labels = Array.from({ length: daysInMonth }, (_, i) => `Ngày ${i + 1}`);
      const data = Array(daysInMonth).fill(0); //mang luu so tai khoan 
      let totalUsersInMonth = 0;

      console.log('Gửi yêu cầu tới API /users (không gửi token)');
      const users = await getAllUsersAPI();
      console.log('Dữ liệu trả về từ API /users:', users);

      if (!Array.isArray(users)) {
        throw new Error('Dữ liệu trả về từ API không phải là mảng.');
      }

      // Lọc bỏ các user có createdAt là null và tính toán
      const validUsers = users.filter(user => user.createdAt !== null);
      console.log('Người dùng có createdAt hợp lệ:', validUsers);

      // Tính tổng số người dùng
      const totalUsers = users.length;

      // Tính số tài khoản được tạo trong tháng hiện tại và số tài khoản mỗi ngày
      validUsers.forEach(user => {
        const createdDate = new Date(user.createdAt);
        if (createdDate.getFullYear() === year && createdDate.getMonth() === month) {
          const day = createdDate.getDate() - 1; // Ngày 1 -> index 0
          data[day]++;
          totalUsersInMonth++;
        }
      });

      setStats({
        usersPerDay: { labels, data },
        totalUsers,
        totalUsersInMonth,
      });
    } catch (error) {
      console.error('Lỗi khi gọi API /users:', error);
      let errorMessage = 'Không thể tải dữ liệu người dùng. Vui lòng thử lại.';
      if (error.response) {
        console.log('Phản hồi lỗi từ server:', error.response.status, error.response.data);
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Bạn không có quyền truy cập hoặc chưa đăng nhập. Vui lòng đăng nhập lại.';
          window.location.href = '/login';
          return;
        } else {
          errorMessage = `Lỗi server: ${error.response.status} - ${error.response.data.message || 'Không xác định'}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Lỗi!',
        text: errorMessage,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // goi api khi component mount
  useEffect(() => {
    fetchUsersAndCalculateStats();
  }, []);

  // ham khoi tao bieu do
  useEffect(() => {
    if (!loading && stats.usersPerDay.labels.length > 0) {
      const ctx = document.getElementById('userChart')?.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: stats.usersPerDay.labels,
            datasets: [{
              label: 'Số tài khoản',
              data: stats.usersPerDay.data,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Số tài khoản' },
              },
              x: {
                title: { display: true, text: 'Ngày trong tháng' },
              },
            },
          },
        });

        return () => chart.destroy(); // Cleanup
      }
    }
    console.log('Dữ liệu thống kê sau khi cập nhật:', stats);
  }, [loading, stats]);

  // Hàm đăng xuất
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
        fetch('https://quiz-project-uqg2.onrender.com/api/auth/logout', {
          method: 'POST',
          credentials: 'include', // Gửi cookie để backend xóa session
        })
          .then(() => {
            window.location.href = '/login';
          })
          .catch(error => {
            console.error('Lỗi khi đăng xuất:', error);
            window.location.href = '/login';
          });
      }
    });
  };

  // Component thống kê tổng quan
  const OverviewStats = () => {
    return (
      <div className={cx('section', 'grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4', 'mb-6')}>
        <div className={cx('bg-white', 'p-4', 'rounded-lg', 'shadow')}>
          <h3 className="text-lg font-semibold">Tổng số người dùng</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className={cx('bg-white', 'p-4', 'rounded-lg', 'shadow')}>
          <h3 className="text-lg font-semibold">Số tài khoản (Tháng này)</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsersInMonth}</p>
        </div>
      </div>
    );
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
            <Link to="/admin/chart" className={cx('active')}>
              <FontAwesomeIcon icon={faChartBar} className="mr-2" /> 
               Thống kê
            </Link>
          </li>
        </ul>
      </aside>

    </div>
  );
}

export default StatisticsPage;