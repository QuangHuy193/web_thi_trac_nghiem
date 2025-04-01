import { useEffect, useState } from "react";
import styles from "./UserPage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function UserPage() {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // test du lieu
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
    };
    setUser(storedUser);

    // test ds bai thi
    setQuizzes([
      { id: 1, title: "Lập trình React", score: 80 },
      { id: 2, title: "JavaScript cơ bản", score: 90 },
      { id: 3, title: "CSS nâng cao", score: 75 },
    ]);
  }, []);

  return (
    <div className={cx("container")}>
      <h2 className={cx("title")}>Thông tin cá nhân</h2>
      {user && (
        <div className={cx("user-info")}>
          <p><strong>Họ và tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <h2 className={cx("title")}>Lịch sử bài thi</h2>
      <ul className={cx("quiz-list")}>
        {quizzes.map((quiz) => (
          <li key={quiz.id} className={cx("quiz-item")}>
            <span>{quiz.title}</span>
            <span className={cx("score")}>{quiz.score}/100</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
