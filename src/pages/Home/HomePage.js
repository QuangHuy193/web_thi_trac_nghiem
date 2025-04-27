//lib
import { useEffect, useState, useCallback } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

//file
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Exam from "../../components/Exam/Exam";
import Info from "../../components/Info/Info";
import History from "../../components/History/History";
import DoExam from "../../components/DoExam/DoExam";
import MakeExam from "../../components/MakeExam/MakeExam";
import ListExam from "../../components/ListExam/ListExam";
import HistoryExam from "../../components/HistoryExam/HistoryExam";
import Loading from "../../components/Loading/Loading";
import Home from "../../components/Home/Home";
import MakeQuestion from "../../components/MakeQuestion/MakeQuestion";
import ListQuestion from "../../components/ListQuestion/ListQuestion";
import ListUserHistory from "../../components/ListUserHistory/ListUserHistory";

import styles from "./HomePage.module.scss";

const cx = classNames.bind(styles);

function HomePage() {
  // Các state chính
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [headerTitle, setHeaderTitle] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [idExam, setIdExam] = useState("");
  const [timeExam, setTimeExam] = useState(0);
  const [questionsExam, setQuestionsExam] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [examEdited, setExamEdited] = useState({});
  const [questionEdited, setQuestionEdited] = useState({});
  const [resultExam, setResultExam] = useState("");
  const [idHistory, setIdHistory] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleLoading, setTitleLoading] = useState("Đang xử lý...");

  // Scroll lên đầu
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Theo dõi scroll để hiện nút lên đầu
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset chỉnh sửa câu hỏi khi đổi nội dung
  useEffect(() => {
    if (selectedContent !== "makeQuestion") setQuestionEdited("");
  }, [selectedContent]);

  // Map nội dung hiển thị
  const contentComponents = {
    exam: (
      <Exam
        user={user}
        setIdExam={setIdExam}
        setTimeExam={setTimeExam}
        selectedSubject={selectedSubject}
        setSelectedContent={setSelectedContent}
        setHeaderTitle={setHeaderTitle}
        setQuestionsExam={setQuestionsExam}
        searchValue={searchValue}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
      />
    ),
    info: (
      <Info
        user={user}
        setUser={setUser}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
      />
    ),
    history: (
      <History
        setSelectedContent={setSelectedContent}
        setHeaderTitle={setHeaderTitle}
        user={user}
        setIdExam={setIdExam}
        setIdHistory={setIdHistory}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
      />
    ),
    doExam: (
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
    ),
    makeQuestion: (
      <MakeQuestion
        user={user}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
        setSelectedContent={setSelectedContent}
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
        questionEdited={questionEdited}
        setQuestionEdited={setQuestionEdited}
      />
    ),
    listQuestion: (
      <ListQuestion
        user={user}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
        setQuestionEdited={setQuestionEdited}
        setSelectedContent={setSelectedContent}
        setHeaderTitle={setHeaderTitle}
        searchValue={searchValue}
      />
    ),
    makeExam: (
      <MakeExam
        user={user}
        setSelectedContent={setSelectedContent}
        setHeaderTitle={setHeaderTitle}
        examEdited={examEdited}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
      />
    ),
    listExam: (
      <ListExam
        user={user}
        setSelectedContent={setSelectedContent}
        setHeaderTitle={setHeaderTitle}
        setExamEdited={setExamEdited}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
        setIdExam={setIdExam}
        searchValue={searchValue}
      />
    ),
    historyExam: (
      <HistoryExam
        idHistory={idHistory}
        resultExam={resultExam}
        questionsExam={questionsExam}
        idExam={idExam}
        setSelectedContent={setSelectedContent}
        setHeaderTitle={setHeaderTitle}
        setTitleLoading={setTitleLoading}
        setIsLoading={setIsLoading}
      />
    ),
    listUserHistory: (
      <ListUserHistory
        idExam={idExam}
        setHeaderTitle={setHeaderTitle}
        setSelectedContent={setSelectedContent}
        setIsLoading={setIsLoading}
        setTitleLoading={setTitleLoading}
      />
    ),
  };

  return (
    <div>
      {isLoading && (
        <Loading setIsLoading={setIsLoading} title={titleLoading} />
      )}
      {/* Header */}
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
        {/* Sidebar */}
        <div className={cx("sidebar")}>
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

        {/* Nội dung chính */}
        <div className={cx("content")}>
          {selectedContent ? contentComponents[selectedContent] : <Home />}

          {/* Nút cuộn lên */}
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

export default HomePage;
