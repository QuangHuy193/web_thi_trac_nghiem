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
import HistoryExam from "../../components/HistoryExam/HistoryExam";
import Loading from "../../components/Loading/Loading";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


import Slider from "react-slick";
const cx = classNames.bind(styles);

function Home() {
  // State lưu trữ nội dung được chọn (để hiển thị content tương ứng)
  const [selectedContent, setSelectedContent] = useState("");

  // State lưu trữ môn học được chọn (theo id môn học) để hiển thị bài thi của môn đó
  const [selectedSubject, setSelectedSubject] = useState("");

  // State lưu trữ tên môn đang chọn dùng cho nút back khi đang trang làm bài
  const [selectedSubjectName, setSelectedSubjectName] = useState("");

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

  //state lưu kết quả làm bài - để hiển thị kết quả khi nộp bài nhưng không đăng nhập
  const [resultExam, setResultExam] = useState("");

  // Stat lưu id lịch sử
  const [idHistory, setIdHistory] = useState("");

  // dùng giá trị này để xác định có tiềm kiếm bài thi hay không
  const [searchValue, setSearchValue] = useState("");

  // dùng để hiện hiệu ứng loading
  const [isLoading, setIsLoading] = useState(false);

  // lưu title loading
  const [titleLoading, setTitleLoading] = useState("Đang xử lý...");

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

  // reset giá trị của search
  useEffect(() => {
    if (selectedContent !== "exam") {
      setSearchValue("");
    }
  }, [selectedContent]);

  // Hàm scroll lên đầu trang khi người dùng nhấn nút
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn trang lên đầu
  };

  return (
    <div>
      {isLoading && (
        <Loading setIsLoading={setIsLoading} title={titleLoading} />
      )}
      {/* Header Component */}
      <Header
        setSelectedContent={setSelectedContent}
        headerTitle={headerTitle}
        setSelectedSubject={setSelectedSubject}
        setHeaderTitle={setHeaderTitle}
        selectedContent={selectedContent}
        user={user}
        setUser={setUser}
        setSearchValue={setSearchValue}
      />

      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          {/* Sidebar Component */}
          <Sidebar
            setSelectedSubjectName={setSelectedSubjectName}
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
              searchValue={searchValue}
            />
          )}

          {selectedContent === "info" && <Info user={user} setUser={setUser} />}
          {!selectedContent && (
            <div className={cx("home")}>
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
              >
                <div>
                  <img src="/bannertoan.jpg" alt="Banner 1" className={cx("banner")} />
                </div>
                <div>
                  <img src="/banner2.jpg" alt="Banner 2" className={cx("banner")} />
                </div>
                <div>
                  <img src="/banner3.jpg" alt="Banner 3" className={cx("banner")} />
                </div>
                <div>
                  <img src="/banner4.jpg" alt="Banner 4" className={cx("banner")} />
                </div>
              </Slider>
              <div className={cx("card-container")}>
                <div className={cx("card")}>
                  <img src="/sachmoi.jpg" alt="Đề thi học kỳ" />
                  <h3>ĐỀ THI HỌC KỲ</h3>
                  <p>
                    Ngân hàng câu hỏi đầy đủ các môn cấp 1,2,3 được trộn tạo đề theo cấu trúc giúp luyện tập hiệu quả.
                  </p>
                </div>

                <div className={cx("card")}>
                  <img src="/sachnon.jpg" Đề thi THPT QG />
                  <h3>ĐỀ THI THPT QG</h3>
                  <p>
                    Tổng hợp đề thi trắc nghiệm của các môn khối thi THPT QG, có đáp án & giải thích chi tiết.
                  </p>
                </div>

                <div className={cx("card")}>
                  <img src="/khoahoc.jpg" alt="Đề kiểm tra" />
                  <h3>ĐỀ KIỂM TRA</h3>
                  <p>
                    Thi thử 15 phút, 1 tiết theo hình thức online, kết quả được chấm điểm tự động.
                  </p>
                </div>
              </div>
            </div>
          )}



          {selectedContent === "history" && (
            <History
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              user={user}
              setIdExam={setIdExam}
              setIdHistory={setIdHistory}
            />
          )}
          {selectedContent === "doExam" && (
            <DoExam
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              idExam={idExam}
              timeExam={timeExam}
              questionsExam={questionsExam}
              user={user}
              setResultExam={setResultExam}
              setIdExam={setIdExam}
              selectedSubject={selectedSubject}
              selectedSubjectName={selectedSubjectName}
              setIsLoading={setIsLoading}
              setTitleLoading={setTitleLoading}
            />
          )}
          {selectedContent === "makeExam" && (
            <MakeExam
              user={user}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              examEdited={examEdited}
              setIsLoading={setIsLoading}
              setTitleLoading={setTitleLoading}
            />
          )}
          {selectedContent === "listExam" && (
            <ListExam
              user={user}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              setExamEdited={setExamEdited}
              setIsLoading={setIsLoading}
              setTitleLoading={setTitleLoading}
            />
          )}

          {selectedContent === "historyExam" && (
            <HistoryExam
              idHistory={idHistory}
              resultExam={resultExam}
              questionsExam={questionsExam}
              idExam={idExam}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
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
