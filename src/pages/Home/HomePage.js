//lib

//file
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./HomePage.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import Exam from "../../components/Exam/Exam";
import Info from "../../components/Info/Info";
import History from "../../components/History/History";

const cx = classNames.bind(styles);

function Home() {
  //xem menu nào dc chọn để hiển thị content tương ứng
  const [selectedContent, setSelectedContent] = useState("");
  // xem môn nào dc chọn để hiện bài thi của môn đó
  const [selectedSubject, setSelectedSubject] = useState("");
  //xem nó là môn cha hay con
  const [typeSubject, setTypeSubject] = useState("");

  return (
    <div>
      <Header setSelectedContent={setSelectedContent} />
      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          {" "}
          <Sidebar
            setSelectedContent={setSelectedContent}
            setSelectedSubject={setSelectedSubject}
            setTypeSubject={setTypeSubject}
          />
        </div>
        <div className={cx("content")}>
          {selectedContent === "exam" && (
            <Exam selectedSubject={selectedSubject} typeSubject={typeSubject} />
          )}
          {selectedContent === "info" && <Info />}
          {selectedContent === "history" && <History />}
        </div>
      </div>
    </div>
  );
}

export default Home;
