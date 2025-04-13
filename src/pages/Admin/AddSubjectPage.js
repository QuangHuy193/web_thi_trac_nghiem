import styles from './AddSubjectPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AddSubjectPage() {
  return (
    <div className={cx('add-subject-container')}>
      <aside className={cx('sidebar')}>
        <h2 className={cx('logo')}>Trang quản trị</h2>
        <ul className={cx('menu')}>
          <li className={cx('menu-item')}>Dashboard</li>
          <li className={cx('menu-item', 'active')}>Quản lý môn học</li>
          <li className={cx('menu-item')}>Quản lý bài thi</li>
          <li className={cx('menu-item')}>Quản lý người dùng</li>
        </ul>
      </aside>

      <main className={cx('main')}>
        <h1 className={cx('title')}>Thêm môn học</h1>

        <div className={cx('section')}>
          <h2 className={cx('section-title')}>Thông tin môn học</h2>
          <form className={cx('subject-form')}>
            <div className={cx('form-group')}>
              <label className={cx('label')}>Tên môn học</label>
              <input type="text" className={cx('input')} placeholder="Nhập tên môn học" />
            </div>
            <div className={cx('form-group')}>
              <label className={cx('label')}>Mô tả</label>
              <textarea className={cx('textarea')} placeholder="Nhập mô tả môn học"></textarea>
            </div>
            <button type="submit" className={cx('submit-btn')}>Thêm môn học</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddSubjectPage;