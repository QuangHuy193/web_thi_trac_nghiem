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
  // xem môn nào dc chọn để hiện bài thi của môn đó (theo id)
  const [selectedSubject, setSelectedSubject] = useState("");
  // title header
  const [headerTitle, setHeaderTitle] = useState(null);

  return (
    <div>
      <Header setSelectedContent={setSelectedContent} headerTitle={headerTitle}/>
      <div className={cx("container")}>
        <div className={cx("sidebar")}>       
          <Sidebar
            setSelectedContent={setSelectedContent}
            setSelectedSubject={setSelectedSubject}
            setHeaderTitle={setHeaderTitle}
          />
        </div>
        <div className={cx("content")}>
          {selectedContent === "exam" && (
            <Exam selectedSubject={selectedSubject} />
          )}
          {selectedContent === "info" && <Info />}
          {selectedContent === "history" && <History />}
        </div>
      </div>
    </div>
  );
}

export default Home;
