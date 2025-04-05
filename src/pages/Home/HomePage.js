//lib

//file
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./HomePage.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import Exam from "../../components/Exam/Exam";
import Info from "../../components/Info/Info";
import History from "../../components/History/History";
import DoExam from "../../components/DoExam/DoExam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import MakeExam from "../../components/MakeExam/MakeExam";
import ListExam from "../../components/ListExam/ListExam";

const cx = classNames.bind(styles);

function Home() {
  // State lưu trữ nội dung được chọn (để hiển thị content tương ứng)
  const [selectedContent, setSelectedContent] = useState("");

  // State lưu trữ môn học được chọn (theo id môn học) để hiển thị bài thi của môn đó
  const [selectedSubject, setSelectedSubject] = useState("");

  // State lưu trữ tiêu đề header
  const [headerTitle, setHeaderTitle] = useState(null);

  // State quản lý việc hiển thị nút scroll lên đầu trang khi cuộn xuống
  const [showScroll, setShowScroll] = useState(false);

  // State lưu trữ id của bài thi (để gửi lên server lưu lịch sử làm bài)
  const [idExam, setIdExam] = useState("");

  // State lưu trữ thời gian của bài thi (time limit)
  const [timeExam, setTimeExam] = useState(0);

  // State lưu trữ danh sách câu hỏi của bài thi đã chọn
  const [questionsExam, setQuestionsExam] = useState([]);

  // State lưu trữ thông tin người dùng (kiểm tra trạng thái đăng nhập)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // State lưu trữ thông tin bài thi đang được chỉnh sửa
  const [examEdited, setExamEdited] = useState({});

  // useEffect để theo dõi sự kiện cuộn trang (scroll) và hiển thị/ẩn nút scroll lên đầu trang
  useEffect(() => {
    const handleScroll = () => {
      // Nếu cuộn xuống trên 200px, hiển thị nút scroll lên đầu trang
      if (window.scrollY > 200) {
        setShowScroll(true);
      } else {
        setShowScroll(false); // Ẩn nút nếu không đủ điều kiện
      }
    };

    // Lắng nghe sự kiện scroll trên cửa sổ
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp sự kiện khi component bị hủy
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Chạy 1 lần khi component được mount

  // Hàm scroll lên đầu trang khi người dùng nhấn nút
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn trang lên đầu
  };

  return (
    <div>
      {/* Header Component */}
      <Header
        setSelectedContent={setSelectedContent}
        headerTitle={headerTitle}
        setSelectedSubject={setSelectedSubject}
        setHeaderTitle={setHeaderTitle}
        selectedContent={selectedContent}
        user={user}
        setUser={setUser}
      />

      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          {/* Sidebar Component */}
          <Sidebar
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            setSelectedSubject={setSelectedSubject}
            setHeaderTitle={setHeaderTitle}
            user={user}
            setExamEdited={setExamEdited}
          />
        </div>

        <div className={cx("content")}>
          {/* Render nội dung tương ứng với selectedContent */}
          {selectedContent === "exam" && (
            <Exam
              user={user}
              setIdExam={setIdExam}
              setTimeExam={setTimeExam}
              selectedSubject={selectedSubject}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              setQuestionsExam={setQuestionsExam}
            />
          )}

          {selectedContent === "info" && <Info user={user} setUser={setUser} />}
          {selectedContent === "history" && <History />}
          {selectedContent === "doExam" && (
            <DoExam
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              idExam={idExam}
              timeExam={timeExam}
              questionsExam={questionsExam}
            />
          )}
          {selectedContent === "makeExam" && (
            <MakeExam
              user={user}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              examEdited={examEdited}
            />
          )}
          {selectedContent === "listExam" && (
            <ListExam
              user={user}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              setExamEdited={setExamEdited}
            />
          )}

          {/* Nút scroll lên đầu trang (Hiển thị khi cuộn trang xuống 200px) */}
          {showScroll && (
            <FontAwesomeIcon
              className={cx("icon-up")}
              icon={faChevronUp}
              onClick={scrollToTop} // Scroll lên đầu trang khi nhấn
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
