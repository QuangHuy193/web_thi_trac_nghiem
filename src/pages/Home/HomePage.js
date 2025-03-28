//lib

//file
import Header from "../../components/Header/Header";
import Login from "../Login/LoginPage";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./HomePage.module.scss";
import classNames from "classnames/bind";

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
  return (
    <div>
      <Header />
      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          {" "}
          <Sidebar data={dataFake} />
        </div>
        <div className={cx("content")}>
          <Login/>
        </div>
      </div>
    </div>
  );
}

export default Home;
