import classNames from "classnames/bind";

import styles from "./ListUserHistory.module.scss";
import IconBack from "../IconBack/IconBack";
import { handleBack } from "../../Utils/function";
import { useEffect, useState } from "react";
import { getListHistoryUserByExamIdAPI } from "../../Api/api";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpShortWide,
  faArrowUpWideShort,
} from "@fortawesome/free-solid-svg-icons";
import TippyCustom from "../TippyCustom/TippyCustom";

const cx = classNames.bind(styles);

function ListUserHistory({
  idExam,
  setHeaderTitle,
  setSelectedContent,
  setIsLoading,
  setTitleLoading,
}) {
  // danh sách user
  const [listHistoryUser, setListHistoryUser] = useState([]);
  // danh sách user để hiển thị
  const [listHistoryUserDisplay, setListHistoryUserDisplay] = useState([]);
  // fetch api xong chưa?
  const [isFetchDone, setIsFetchDone] = useState(false);
  // lưu trạng thái sắp xếp
  const [statusSort, setStatusSort] = useState({
    score: "ascending",
    finished_at: "ascending",
  });

  useEffect(() => {
    const getListUser = async () => {
      setTitleLoading("Đang tải danh sách thí sinh...");
      setIsLoading(true);
      const rs = await getListHistoryUserByExamIdAPI(idExam);
      setIsFetchDone(true);
      setIsLoading(false);
      setListHistoryUser(rs);
      setListHistoryUserDisplay(rs);
    };

    getListUser();
  }, []);

  const handleFilterScore = (e) => {
    const value = e.target.value;

    let filteredTakers = [];

    if (value === "=0") {
      filteredTakers = listHistoryUser.takers.filter(
        (user) => user.score === 0
      );
    } else if (value === ">0") {
      filteredTakers = listHistoryUser.takers.filter((user) => user.score > 0);
    } else if (value === ">=5") {
      filteredTakers = listHistoryUser.takers.filter((user) => user.score >= 5);
    } else if (value === ">=8") {
      filteredTakers = listHistoryUser.takers.filter((user) => user.score >= 8);
    } else if (value === "=10") {
      filteredTakers = listHistoryUser.takers.filter(
        (user) => user.score === 10
      );
    } else {
      filteredTakers = listHistoryUser.takers;
    }

    // 📌 Sort filteredTakers trước khi set
    const sortedTakers = filteredTakers.sort((a, b) => {
      const timeA = new Date(a.finished_at).getTime();
      const timeB = new Date(b.finished_at).getTime();

      if (statusSort === "ascending") {
        return timeA - timeB;
      } else {
        return timeB - timeA;
      }
    });

    // 📌 Cập nhật list hiển thị
    setListHistoryUserDisplay({
      ...listHistoryUser,
      takers: sortedTakers,
    });
  };

  const handleSort = (field) => {
    const newStatusSort =
      statusSort[field] === "ascending" ? "decreasing" : "ascending";

    const sorted = [...listHistoryUserDisplay.takers].sort((a, b) => {
      const valueA =
        field === "finished_at" ? new Date(a.finished_at).getTime() : a[field];
      const valueB =
        field === "finished_at" ? new Date(b.finished_at).getTime() : b[field];

      if (newStatusSort === "ascending") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setListHistoryUserDisplay({
      ...listHistoryUserDisplay,
      takers: sorted,
    });

    setStatusSort((prev) => ({
      ...prev,
      [field]: newStatusSort,
    }));
  };

  return (
    <div className={cx("container")}>
      <IconBack
        handleBack={() =>
          handleBack(
            setHeaderTitle,
            "Danh sách bài thi",
            setSelectedContent,
            "listExam"
          )
        }
      />

      {isFetchDone && (
        <div className={cx("title")}>{listHistoryUser.exam.title}</div>
      )}

      {/* các bộ lọc */}
      <div className={cx("filter-score")}>
        <label>Lọc điểm</label>
        <select
          onChange={(e) => {
            handleFilterScore(e);
          }}
        >
          <option value="">Tất cả</option>
          <option value="=0">Điểm = 0</option>
          <option value=">0">Điểm &gt; 0</option>
          <option value=">=5">Điểm &gt;= 5</option>
          <option value=">=8">Điểm &gt;= 8</option>
          <option value="=10">Điểm = 10</option>
        </select>
      </div>

      {/* danh sách user */}
      {isFetchDone ? (
        listHistoryUserDisplay.takers?.length > 0 ? (
          <div className={cx("list-user")}>
            {/* HÀNG TIÊU ĐỀ */}
            <div className={cx("group-user", "header")}>
              <div className={cx("username")}>Tên thí sinh</div>
              <div className={cx("email")}>Email</div>
              <div className={cx("score")}>
                Điểm
                <TippyCustom
                  content={
                    statusSort.score === "ascending"
                      ? "Sắp xếp tăng dần"
                      : "Sắp xếp giảm dần"
                  }
                >
                  <span
                    onClick={() => {
                      handleSort("score");
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        statusSort.score === "ascending"
                          ? faArrowUpWideShort
                          : faArrowUpShortWide
                      }
                    />
                  </span>
                </TippyCustom>
              </div>
              <div className={cx("finished_at")}>
                Thời gian nộp
                <TippyCustom
                  content={
                    statusSort.finished_at === "ascending"
                      ? "Sắp xếp tăng dần"
                      : "Sắp xếp giảm dần"
                  }
                >
                  <span
                    onClick={() => {
                      handleSort("finished_at");
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        statusSort.finished_at === "ascending"
                          ? faArrowUpWideShort
                          : faArrowUpShortWide
                      }
                    />
                  </span>
                </TippyCustom>
              </div>
            </div>

            {/* DANH SÁCH THÍ SINH */}
            {listHistoryUserDisplay.takers?.map((taker) => (
              <div className={cx("group-user")}>
                <div className={cx("username")}>{taker.username}</div>
                <div className={cx("email")}>{taker.email}</div>
                <div className={cx("score")}>{taker.score}</div>
                <div className={cx("finished_at")}>
                  {dayjs(taker.finished_at).format("HH:mm DD/MM/YYYY")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cx("no-user")}>
            Chưa có thí sinh nào làm bài thi này!
          </div>
        )
      ) : null}
    </div>
  );
}

export default ListUserHistory;
