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

//fake data
const dataFake = [
  {
    subjects: "Toán",
    item: ["Toán 10", "Toán 11", "Toán 12"],
  },
  {
    subjects: "Văn",
    item: ["Văn 10", "Văn 11", "Văn 12"],
  },
];

function Home() {
  const [selectedContent, setSelectedContent] = useState("");

  return (
    <div>
      <Header />
      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          {" "}
          <Sidebar data={dataFake} setSelectedContent={setSelectedContent} />
        </div>
        <div className={cx("content")}>
          {selectedContent === "exam" && <Exam />}
          {selectedContent === "info" && <Info />}
          {selectedContent === "history" && <History />}
        </div>
      </div>
    </div>
  );
}

export default Home;
