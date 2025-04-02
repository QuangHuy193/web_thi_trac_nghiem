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

const cx = classNames.bind(styles);

function Home() {
  //xem menu nào dc chọn để hiển thị content tương ứng
  const [selectedContent, setSelectedContent] = useState("");
  // xem môn nào dc chọn để hiện bài thi của môn đó (theo id)
  const [selectedSubject, setSelectedSubject] = useState("");
  // title header
  const [headerTitle, setHeaderTitle] = useState(null);
  //scroll up
  const [showScroll, setShowScroll] = useState(false);
  // id bài thi dùng để gửi lên server lưu lịch sử
  const [idExam, setIdExam] = useState("");
  // kiểm tra trạng thái đăng nhập
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
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
          <Sidebar
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            setSelectedSubject={setSelectedSubject}
            setHeaderTitle={setHeaderTitle}
            user={user}
          />
        </div>
        <div className={cx("content")}>
          {selectedContent === "exam" && (
            <Exam
              setIdExam={setIdExam}
              selectedSubject={selectedSubject}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
            />
          )}
          {selectedContent === "info" && <Info user={user} setUser={setUser} />}
          {selectedContent === "history" && <History />}
          {selectedContent === "doExam" && (
            <DoExam
              selectedSubject={selectedSubject}
              setSelectedContent={setSelectedContent}
              setHeaderTitle={setHeaderTitle}
              idExam={idExam}
            />
          )}
          {showScroll && (
            <FontAwesomeIcon
              className={cx("icon-up")}
              icon={faChevronUp}
              onClick={scrollToTop}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
